import express from "express";

import openApiDocument from "../utils/openApiDocument.js";
import miscController from "../controllers/miscController.js";

const router = express.Router();

router.get("/openapi.json", (req, res) => miscController.getOpenApi(req, res, openApiDocument));
router.get("/about", miscController.about);

export default router;

