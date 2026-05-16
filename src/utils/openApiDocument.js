const noteSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    content: { type: "string" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

export default {
  openapi: "3.0.4",
  info: {
    title: "Notes App API",
    version: "1.0.0",
    description: "REST API for multi-user notes with JWT authentication and note sharing.",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Note: noteSchema,
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  paths: {
    "/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
          400: { description: "Invalid input" },
          409: { description: "Email already registered" },
        },
      },
    },
    "/login": {
      post: {
        summary: "Authenticate a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "JWT token returned" },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/notes": {
      get: {
        summary: "Get notes created by the authenticated user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
        responses: { 200: { description: "Notes returned" }, 401: { description: "Unauthorized" } },
      },
      post: {
        summary: "Create a note",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: { type: "string", maxLength: 160 },
                  content: { type: "string", maxLength: 10000 },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Note created" }, 400: { description: "Invalid input" } },
      },
    },
    "/notes/{id}": {
      get: {
        summary: "Get a note by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Note returned" }, 404: { description: "Note not found" } },
      },
      put: {
        summary: "Update an owned note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Note updated" }, 404: { description: "Note not found" } },
      },
      delete: {
        summary: "Delete an owned note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Note deleted" }, 404: { description: "Note not found" } },
      },
    },
    "/notes/{id}/share": {
      post: {
        summary: "Share an owned note with another user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Note shared" }, 404: { description: "Note or user not found" } },
      },
    },
    "/notes/{id}/pin": {
      post: {
        summary: "Pin an owned note to the top",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Note pinned" }, 404: { description: "Note not found" } },
      },
    },
    "/notes/{id}/unpin": {
      post: {
        summary: "Unpin an owned note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Note unpinned" }, 404: { description: "Note not found" } },
      },
    },
    "/search": {
      get: {
        summary: "Search owned notes by keyword",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Matching notes returned" }, 400: { description: "Missing query" } },
      },
    },
    "/openapi.json": {
      get: { summary: "OpenAPI document", responses: { 200: { description: "OpenAPI JSON" } } },
    },
    "/about": {
      get: { summary: "Candidate and feature information", responses: { 200: { description: "About JSON" } } },
    },
  },
};

