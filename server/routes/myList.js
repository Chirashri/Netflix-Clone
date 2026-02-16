const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

/* GET MY LIST */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD TO MY LIST */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const exists = user.myList.find(
      (movie) => movie.id === req.body.id
    );

    if (exists) {
      return res.status(400).json({ message: "Already in list" });
    }

    user.myList.push(req.body);
    await user.save();

    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* REMOVE FROM MY LIST */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.myList = user.myList.filter(
      (movie) => movie.id !== Number(req.params.id)
    );

    await user.save();

    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
