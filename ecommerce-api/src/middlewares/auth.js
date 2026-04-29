import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  try {
    const token = header.substring(7);
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
