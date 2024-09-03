import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";
import { Base64 } from "js-base64";

const CLIENT_ID =
  "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

function createEmailMessage(to: string, subject: string, messageText: string) {
  // Create the MIME email content
  const message = [
    `From: "Your Name" <your-email@example.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    "",
    messageText,
  ].join("\n");

  // Base64url encode the MIME message
  return Base64.encodeURI(message);
}
export async function GET(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const accessToken = cookies.access_token;
  const refreshToken = cookies.refresh_token;

  // Use the tokens to authenticate API requests
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const to = "recipient@example.com";
  const subject = "Hello from Gmail API";
  const messageText = "Hello, World! update";

  const response = await gmail.users.drafts.update({
    id: "r-4018786540289691251",
    userId: "me",
    requestBody: {
      message: {
        raw: createEmailMessage(to, subject, messageText),
      },
    },
  });

  return NextResponse.json(response.data);
}
