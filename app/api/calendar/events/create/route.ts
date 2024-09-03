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

  const response = await calendar.events.insert({
    calendarId: "055ae04abc072074a1a338642b868f64e39b70020093e69a677aafa58d4c63db@group.calendar.google.com",
    requestBody: {
      summary: "Sample Event", // Title of the event
      description: "This is a sample event created via the Google Calendar API.",
      start: {
        dateTime: "2024-09-10T09:00:00-07:00", // Start time in ISO format
        timeZone: "America/Los_Angeles" // Time zone
      },
      end: {
        dateTime: "2024-09-10T10:00:00-07:00", // End time in ISO format
        timeZone: "America/Los_Angeles" // Time zone
      },
      // Optional fields can be added here
    },
  });


  return NextResponse.json(response.data);
}
