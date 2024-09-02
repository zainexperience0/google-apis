import { z } from "zod";

// Define the schema
const bloggerPostSchema = z.object({
  kind: z.literal("blogger#post"),
  id: z.string(),
  blog: z.object({
    id: z.string(),
  }),
  published: z.string().datetime(),
  updated: z.string().datetime(),
  url: z.string().url(),
  selfLink: z.string().url(),
  title: z.string(),
  titleLink: z.string().optional(),
  content: z.string(),
  images: z.array(
    z.object({
      url: z.string().url(),
    })
  ),
  customMetaData: z.string().optional(),
  author: z.object({
    id: z.string(),
    displayName: z.string(),
    url: z.string().url(),
    image: z.object({
      url: z.string().url(),
    }),
  }),
  replies: z.object({
    totalItems: z.number().int(),
    selfLink: z.string().url(),
    items: z.array(z.unknown()), // Use z.unknown() for complex or unknown types
  }),
  labels: z.array(z.string()).optional(),
  location: z.object({
    name: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    span: z.string().optional(),
  }).optional(),
  status: z.string().optional(),
});

// Example usage:
const examplePost = {
  kind: "blogger#post",
  id: "123456",
  blog: { id: "7890" },
  published: "2023-09-01T12:00:00Z",
  updated: "2023-09-01T12:30:00Z",
  url: "https://example.com/post/123456",
  selfLink: "https://blogger.googleapis.com/v3/blogs/7890/posts/123456",
  title: "Sample Post",
  content: "<p>This is a sample post content.</p>",
  images: [{ url: "https://example.com/image.jpg" }],
  author: {
    id: "authorId",
    displayName: "Author Name",
    url: "https://example.com/author",
    image: { url: "https://example.com/author-image.jpg" },
  },
  replies: {
    totalItems: 5,
    selfLink: "https://blogger.googleapis.com/v3/blogs/7890/posts/123456/comments",
    items: [],
  },
  labels: ["label1", "label2"],
  location: {
    name: "Sample Location",
    lat: 37.4221,
    lng: -122.0841,
    span: "0.01,0.01",
  },
  status: "LIVE",
};

// Validate the example post
const validation = bloggerPostSchema.safeParse(examplePost);
console.log(validation);
