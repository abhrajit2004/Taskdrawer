import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT Token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "7d" });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
