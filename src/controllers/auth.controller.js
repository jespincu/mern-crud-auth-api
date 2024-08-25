import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  //console.log(username + ' ' + email + ' ' + password);
  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json(["The email is already in use"]);
    }

    // Hash the password before saving it to the database
    const passwordHashed = await bcrypt.hash(password, 10);
    // Save user to the database
    const newUser = new User({
      username,
      email,
      password: passwordHashed,
    });

    const userCreated = await newUser.save();
    const token = await createAccessToken({
      id: userCreated._id,
      email: userCreated.email,
    });

    res.cookie("token", token);
    res.json({
      message: "User registered successfully",
      data: {
        id: userCreated._id,
        username: userCreated.username,
        email: userCreated.email,
        createdAt: userCreated.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = await createAccessToken({
      id: userFound._id,
      email: userFound.email,
    });

    res.cookie("token", token);
    res.json({
      message: "User registered successfully",
      data: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  //res.clearCookie('token');
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.json({ message: "Logged out successfully" });
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({
    message: "Profile",
    data: {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    },
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.staus(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);

    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      message: "Token is valid",
      data: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
      },
    });
  });
};
