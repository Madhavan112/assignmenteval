import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};

export const isTeacher = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "teacher") return next();
  return res.status(403).json({ message: "Forbidden" });
};

export const isStudent = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "student") return next();
  return res.status(403).json({ message: "Forbidden" });
};
