const mongoose = require("mongoose");

const Items = new mongoose.Schema({
  // mongodb validation
  ItemName: {
    type: String,
    required: [true, "Please enter the item name"],
    unique: true,
  },
  ItemDescription: {
    type: String,
    required: [true, "Please enter item description"],
    unique: false,
  },
  Price: {
    type: Number,
    // required: [true, "Please enter item price"],
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  ItemQuantaties: {
    pizzaBoard: {
      type: Number,
    },
    tomato: {
      type: Number,
    },
    peper: {
      type: Number,
    },
    olive: {
      type: Number,
    },
    cheese: {
      type: Number,
    },
    chicken: {
      type: Number,
    },
    salami: {
      type: Number,
    },
    meat: {
      type: Number,
    },
    sauce: {
      type: Number,
    },
  },
});

const oneItem = mongoose.model("item", Items);

module.exports = { oneItem };

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
