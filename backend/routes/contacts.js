const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact({ name, email, phone }) {
  if (!name || !name.trim()) return "Name is required";
  if (!email || !email.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(email.trim())) return "Please enter a valid email";
  if (!phone || !phone.trim()) return "Phone number is required";
  return null;
}

async function findContactOr404(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: "Contact not found" });
    return null;
  }
  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
    return null;
  }
  return contact;
}

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const error = validateContact(req.body || {});
  if (error) return res.status(400).json({ message: error });
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const error = validateContact(req.body || {});
  if (error) return res.status(400).json({ message: error });
  try {
    const contact = await findContactOr404(req.params.id, res);
    if (!contact) return;
    contact.name = req.body.name.trim();
    contact.email = req.body.email.trim();
    contact.phone = req.body.phone.trim();
    await contact.save();
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await findContactOr404(req.params.id, res);
    if (!contact) return;
    await contact.deleteOne();
    res.json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
