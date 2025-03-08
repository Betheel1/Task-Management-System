const mongoose =require( "mongoose");
const bcrypt =require( "bcryptjs");

// Define the User schema
const userSchema = mongoose.Schema(
  {
   
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ "manager", "user"], // The possible roles
      default: "user", // Default role for new users
    },
  },
  { timestamps: true }
);

// Method to hash password before saving it to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare provided password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports= User;
