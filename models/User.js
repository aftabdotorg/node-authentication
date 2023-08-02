// ! Database 
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please provide a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Incorrect Password");
    }
  } else {
    throw Error("Incorrect Email");
  }
};

const User = mongoose.model("user", userSchema);
module.exports = User;
