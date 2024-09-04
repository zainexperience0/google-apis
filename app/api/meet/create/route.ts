import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Missing access token or refresh token" }, { status: 401 });
    }

    // Use the tokens to authenticate API requests
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Create a calendar event with Google Meet conference details
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "Test Meeting 2",
        description: "A meeting with Google Meet",
        start: {
          dateTime: new Date().toISOString(), // Specify start time
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // End time (1 hour later)
          timeZone: "UTC",
        },
        conferenceData: {
          createRequest: {
            requestId: "sample123", // Unique ID for the request
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
      conferenceDataVersion: 1, // Enable Meet link creation
    });

    return NextResponse.json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    console.error("Error creating Google Meet space:", error);
    return NextResponse.json({ error: "Failed to create Google Meet space" }, { status: 500 });
  }
}
