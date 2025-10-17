// apps/api/src/utils/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // ✅ make sure .env loads before reading the secret

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing in .env!");
  throw new Error("JWT_SECRET is not defined. Please check your .env file.");
}

/**
 * Generate a signed JWT token.
 * @param {Object} payload - Data to embed in the token (e.g. { id, email, role })
 * @param {string} [expiresIn="7d"] - Token expiration
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = "7d") => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("❌ JWT sign error:", error.message);
    throw error;
  }
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("❌ JWT verify error:", error.message);
    throw new Error("Invalid or expired token");
  }
};
