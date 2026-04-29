import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, details: err.details },
    });
  }

  console.error(err);
  res.status(500).json({ error: { message: "Internal server error" } });
};
