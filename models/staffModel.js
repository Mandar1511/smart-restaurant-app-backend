const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "Account already exists please sign in"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: {
      values: ["customer", "waiter", "chef", "manager", "admin", "owner"],
      message: "Invalid role value",
    },
    required: [true, "Role is required"],
  },
  
});

staffSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
});

staffSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
