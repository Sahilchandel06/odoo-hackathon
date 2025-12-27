const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role
  });

  res.json({ message: "Signup successful" });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({ message: "User not found. Please sign up." });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};
