import UserModel from "../Modals/AuthModal.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const onAdminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already in use",
        message: "Email already exists",
      });
    }
    // Create new admin user
    const newAdminUser = new UserModel({
      name,
      email,
      password,
      role: "admin",
    });
    const savedUser = await newAdminUser.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.log("adminregister error: " + error);

    return res
      .status(500)
      .json({ error: error.message, message: "Admin registration error" });
  }
};

export const onLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      if (password === user.password) {
        const payload = {
          email: user.email,
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
        return res.status(200).json({ token: jwtToken, role: user.role });
      } else {
        return res.status(400).json({
          message: "Password is in-correct...!",
        });
      }
    } else {
      return res.status(400).json({
        message: "User not found...!",
      });
    }
  } catch (error) {
    console.log("admin login failed", error);
    return res
      .status(500)
      .json({ error: error.message, message: "Admin login error" });
  }
};

export const onProfile = async (req, res) => {
  const { user } = req;
  try {
    res.status(200).json(user);
  } catch (error) {
    console.log({ error: error.message, message: "Admin login error" });
    return res
      .status(500)
      .json({ message: "Admin login error " + error.message });
  }
};
