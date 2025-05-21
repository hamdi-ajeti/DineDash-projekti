import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password!" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register User
const registerUser = async (req, res) => {
  const { name, password, email, fromAdmin } = req.body; // ✅ include fromAdmin

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists!" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format!" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // ✅ If this registration was done by admin, don't return a token
    if (fromAdmin) {
      return res.json({ success: true, message: "User registered successfully" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};


// List Users
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude password
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching users" });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id, name, email, password, cartData } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }
    if (password) {
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (cartData) {
      user.cartData = cartData;
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating user" });
  }
};

// Remove User
const removeUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User removed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing user" });
  }
};

export { loginUser, registerUser, listUsers, updateUser, removeUser };
