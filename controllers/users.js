import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const routes = {};

routes.signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const oldUser = await user.findOne({ email });
    if (oldUser) return res.status(400).json({ error: "Email already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const hashedPassword = await bcrpyt.hash(password, 12);

    const newUser = await user.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      result: newUser,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

routes.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await user.findOne({ email });
    if (!oldUser) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrpyt.compare(password, oldUser.password);
    if (!isMatch) return res.status(401).json({ error: "Password incorrect" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      result: oldUser,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default routes;
