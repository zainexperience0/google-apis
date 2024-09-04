import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "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";
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing access token or refresh token" },
        { status: 401 }
      );
    }

    // Use the tokens to authenticate API requests
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const slides = google.slides({ version: "v1", auth: oauth2Client });

    const response = await slides.presentations.create({
        requestBody: {
            title: 'test '
        }
    })

    return NextResponse.json({data: response.data})
  } catch (error) {
    console.error("Error creating :", error);
    return NextResponse.json({ error: "Failed to create " }, { status: 500 });
  }
}
