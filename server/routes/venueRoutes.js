const express = require("express");
const router = express.Router();

const Venue = require("../models/Venue");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, location } = req.body;

    const venue = new Venue({
      name,
      location
    });

    await venue.save();

    res.status(201).json({
      message: "Venue created successfully",
      venue
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().populate("queues");

    res.json(venues);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


router.get("/:id", async (req, res) => {
  try {

    const venue = await Venue.findById(req.params.id)
      .populate("queues");

    if (!venue) {
      return res.status(404).json({
        message: "Venue not found"
      });
    }

    res.json(venue);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;