import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  },
};

if (!env.jwt.secret) {
  throw new Error("JWT_SECRET is required");
}
