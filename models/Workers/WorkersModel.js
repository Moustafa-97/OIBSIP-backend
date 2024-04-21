const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");
// const { send } = require("process");

const Worker = new mongoose.Schema({
  // mongodb validation
  firstName: {
    type: String,
    required: [true, "Please enter the first name"],
    unique: false,
  },
  lastName: {
    type: String,
    required: [true, "Please enter the last name"],
    unique: false,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Minimum password length is 8 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Minimum password length is 8 characters"],
  },
  theme: {
    type: String,
  },
});

Worker.pre("save", async function (next) {
  if (!this.isModified(["password", "confirmPassword"])) {
    return next();
  } // to prevent password chage while update

  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  this.confirmPassword = await bcryptjs.hash(this.confirmPassword, salt);
  next();
});

Worker.statics.login = async function (email, password) {
  const worker = await this.findOne({ email });
  if (worker) {
    const autheticated = await bcryptjs.compare(password, worker.password);
    if (autheticated) {
      return worker;
    } else {
      throw new Error("Invalid Password");
    }
  } else {
    throw new Error("Invalid email");
  }
};

const worker = mongoose.model("Worker", Worker);

module.exports = { worker };
