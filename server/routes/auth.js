const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


/* ================= PROTECTED ROUTE ================= */

router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});


/* ================= ADD TO MY LIST ================= */

router.post("/mylist", authMiddleware, async (req, res) => {
  try {
    const movie = req.body;

    const user = await User.findById(req.user._id);

    const exists = user.myList.find((m) => m.id === movie.id);

    if (exists) {
      return res.status(400).json({ message: "Movie already in list" });
    }

    user.myList.push(movie);
    await user.save();

    res.json({ message: "Movie added to My List", myList: user.myList });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* DELETE USER (temporary) */
router.delete("/delete-user", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "All users deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= REMOVE FROM MY LIST ================= */

router.delete("/mylist/:movieId", authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user._id);

    user.myList = user.myList.filter(
      (movie) => movie.id != movieId
    );

    await user.save();

    res.json({
      message: "Movie removed from My List",
      myList: user.myList,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= GET MY LIST ================= */

router.get("/mylist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user.myList);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
