import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

// ---------------------- SIGNUP ----------------------
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id.toString(), role);

    res
      .cookie("token", token, { httpOnly: true, sameSite: "lax" })
      .status(201)
      .json({
        message: "Signup successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // <-- IMPORTANT
      });

  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err });
  }
};

// ---------------------- LOGIN ----------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString(), user.role);

    res
      .cookie("token", token, { httpOnly: true, sameSite: "lax" })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // <-- IMPORTANT
      });

  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
};

// ---------------------- LOGOUT ----------------------
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err });
  }
};
