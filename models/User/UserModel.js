const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");

const User = new mongoose.Schema({
  // mongodb validation
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    unique: false,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your first name"],
    unique: false,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
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
  account:{
    type: String,
    default: "user",
  },
  cart: [
    {
      order: {
        itemDetails: {
          _id: {
            type: String,
          },
          ItemName: {
            type: String,
          },
          Price: {
            type: Number,
          },
        },
        quantity: {
          type: Number,
        },
      },
    },
  ],
  wishlist: {
    type: Array,
  },
  theme: {
    type: String,
  },
});

User.pre("save", async function (next) {
  if (!this.isModified(["password", "confirmPassword"])) {
    return next();
  } // to prevent password chage while update

  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  this.confirmPassword = await bcryptjs.hash(this.confirmPassword, salt);
  next();
});

User.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const autheticated = await bcryptjs.compare(password, user.password);

    if (autheticated) {
      return user;
    } else {
      throw new Error("Invalid Password");
    }
  } else {
    throw new Error("Invalid email");
  }
};

const user = mongoose.model("user", User);

module.exports = { user };

/*
In your schema, you can include an array of objects as a property. For example:

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlist: [
    {
      productId: {
        type: String,
      },
      name: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  ],
});

To update the wishlist array, you can use the .findOneAndUpdate() method from Mongoose. For example:

User.findOneAndUpdate(
  { email: req.body.email },
  {
    $push: {
      wishlist: {
        productId: req.body.productId,
        name: req.body.name,
        image: req.body.image,
      },
    },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      // handle error
    } else {
      // send response
    }
  }
);


To remove an object from the wishlist array, you can use the .findOneAndUpdate() method with the $pull operator. For example:

User.findOneAndUpdate(
  { email: req.body.email },
  {
    $pull: {
      wishlist: {
        productId: req.body.productId,
      },
    },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      // handle error
    } else {
      // send response
    }
  }
);

This will remove the object with the specified productId from the wishlist array for the user with the specified email address.

*/
