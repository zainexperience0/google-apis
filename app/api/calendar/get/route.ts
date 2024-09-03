import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";

const CLIENT_ID =
  "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const accessToken = cookies.access_token;
  const refreshToken = cookies.refresh_token;

  // Use the tokens to authenticate API requests
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const response = await calendar.calendars.get({
    calendarId:
      "d9c954571877f941ae60ccddde2f44e64ca4f2331e1b4bcc6b6c077fcc30f9f6@group.calendar.google.com",
  });

  return NextResponse.json(response.data);
}
