const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // ── Auth fields ──────────────────────────
    googleId: {
      type: String,
      default: null,
      // Google's unique sub ID from id_token
    },
    password: {
      type: String,
      default: null,
      // Optional: hashed password for email+password login (future use)
      select: false, // never returned in queries by default
    },
    authProvider: {
      type: String,
      enum: ['phone_otp', 'google', 'email_password'],
      default: 'phone_otp',
    },
    // ── Identity fields ─────────────────────
    phone: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values (Google users may not have phone yet)
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
      default: null,
    },
    aadhaar: {
      type: String,
      trim: true,
      default: null,
      // Stored as hashed in production; plain for demo
    },
    bankAccount: {
      accountNumber: { type: String, default: null },
      ifscCode: { type: String, default: null },
      accountHolderName: { type: String, default: null },
    },
    upiId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'transport', 'admin'],
      required: [true, 'Role is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    trustScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isKYCDone: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banExpiresAt: {
      type: Date,
      default: null,
    },
    fakeDisputeCount: {
      type: Number,
      default: 0,
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    preferredLanguage: {
      type: String,
      enum: ['hi', 'en', 'mr', 'ta', 'te', 'bn'],
      default: 'hi',
    },
    fcmToken: {
      type: String,
      default: null, // Firebase push notification token
    },
  },
  { timestamps: true }
);

// Prevent returning sensitive fields by default
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.aadhaar;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
