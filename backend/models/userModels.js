import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "not-mentioned"],
    },
    profileImage: {
      type: String,
      default: "/images/default_user.png",
    },
    category: {
      type: String,
      enum: ["Tutoring", "Household", "Medical", "Vehicle", "Other"],
      required: false,
    },
    role: {
      type: String,
      enum: ["provider", "seeker"],
      required: true,
    },
  },
  { timestamps: true }
);

// pre-save hook for password hashing

userSchema.pre("save", async function (next) {
  if (!this.isModified("password"))
    //only hash is password is new or updated
    return next();
  try {
    const salt = await bcrypt.genSalt(10); //generate salt
    this.password = await bcrypt.hash(this.password, salt); //hash password
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
