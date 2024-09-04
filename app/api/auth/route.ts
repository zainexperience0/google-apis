import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";

// Define OAuth2 client credentials
const CLIENT_ID =
  "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/api/auth";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/blogger",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive.apps.readonly",
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/meetings.space.created",
        "https://www.googleapis.com/auth/meetings.space.readonly",
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.metadata",
        "https://www.googleapis.com/auth/tasks"
      ],
    });
    return NextResponse.redirect(url);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    };
    const response = NextResponse.json(tokens, { status: 200 });

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("access_token", tokens.access_token as any, {
        ...cookieOptions,
        maxAge: 3600, // Example: 1 hour (adjust based on token expiration)
      })
    );

    response.headers.append(
      "Set-Cookie",
      cookie.serialize("refresh_token", tokens.refresh_token as any, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // Example: 30 days (adjust based on your use case)
      })
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
