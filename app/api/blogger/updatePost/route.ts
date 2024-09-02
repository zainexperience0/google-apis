import { google } from "googleapis";
import { NextResponse } from "next/server";
import cookie from "cookie";

// OAuth2 Client Configuration
const CLIENT_ID =
  "43052531586-oesjlmngvr40ckg5av7gp7c30oj2ivsq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

// Create a Singleton OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Initialize Blogger API Client Once
const blogger = google.blogger({ version: "v3", auth: oauth2Client });

export async function GET(req: Request) {
  try {
    // Parse cookies and retrieve tokens
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing access or refresh token." },
        { status: 401 }
      );
    }

    // Set OAuth2 client credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Make the Blogger API request to delete a post
    const response = await blogger.posts.update({
      blogId: "2587371787134288937",
      postId: "5499056267292538149",
    });

    return NextResponse.json(
      {
        "post updated successfully": response.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting post:", error);

    // Handle specific errors (e.g., token expiration, network errors)
    if (error.response && error.response.status === 401) {
      return NextResponse.json(
        { error: "Unauthorized. Please re-authenticate." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete the post." },
      { status: 500 }
    );
  }
}
