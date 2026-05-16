const getOpenApi = (_req, res, openApiDocument) => {
  res.status(200).json(openApiDocument);
};

const about = (_req, res) => {
  res.status(200).json({
    name: process.env.ABOUT_NAME || "Harsh",
    email: process.env.ABOUT_EMAIL || "harsh@example.com",
    "my features": {
      "Full-text search":
        "GET /search?q=keyword lets users quickly find their own notes by title or content, which is essential once a notes app grows beyond a few entries.",
      Pagination:
        "GET /notes supports page and limit query parameters to keep responses fast for users with many notes.",
      "Secure sharing":
        "Shared notes are readable by recipients through GET /notes/{id}, while only the original owner can edit, delete, or reshare the note.",
      "Pin notes":
        "POST /notes/{id}/pin and POST /notes/{id}/unpin let users pin important notes; GET /notes sorts pinned notes to the top.",
    },
  });
};

export default {
  getOpenApi,
  about,
};

