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

  const task = google.tasks({
    version: "v1",
    auth: oauth2Client,
  });

  const tasks = await task.tasks.delete({
    tasklist: "MDkxNTM5NTUxODU3MzcxNDA4OTk6MDow",
    task: "UTYxTnhfWEI4ZHY0ZUs3Vg",
  });

  return NextResponse.json({ tasks: tasks.data });
}
