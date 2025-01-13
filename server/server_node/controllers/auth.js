import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-identicon-sprites";

export const signUp = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const avatarSvg = createAvatar(sprites, {
      seed: username || email,
      radius: 50,
    });

    const avatarBase64 = Buffer.from(avatarSvg).toString("base64");

    const newAccount = new User({
      email,
      password: passwordHash,
      username,
      avatar: `data:image/svg+xml;base64,${avatarBase64}`,
    });

    const newUser = await newAccount.save();

    return res.status(200).send(newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).send({ error: "Error creating user" });
  }
};

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist. ");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password.");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send(user);
  } catch (err) {
    throw new Error(err);
  }
}

export const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id: verified.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
