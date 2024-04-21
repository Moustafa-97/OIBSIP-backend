const asyncHandler = require("express-async-handler");
const { user } = require("../../models/User/UserModel");
const { oneItem } = require("../../models/Items/ItemModel");
const { GenerateUserToken } = require("../../utils/generateUserToken");
const { order } = require("../../models/Orders/OrdersModel");
const { lineItemsF } = require("../../config/payment");
// const { json } = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code, err);
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already in use.";
    return errors;
  }
  // validation errors
  if (err.message.includes("newUser validation failed")) {
    console.log(err);
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
// ⭐
// @desc auth user isLoged
// @desc POST /user/isLoged
// @access Public
module.exports.is_logged = asyncHandler(async (req, res, next) => {
  res.status(200).json({ user: req.user, state: true });
});
// ⭐
// @desc auth user signup - token
// @desc POST /user/signup
//  @access private (by login)
module.exports.auth_user_signup = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    image,
    email,
    password,
    confirmPassword,
    theme,
  } = req.body.newUser;
  try {
    await user.create({
      firstName,
      lastName,
      image,
      email,
      password,
      confirmPassword,
      theme,
    });
    res
      .status(200)
      .json({ message: "Account created successfuly", status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ message: errors, state: false });
  }
});
// ⭐
// @desc auth user login - token
// @desc POST /user/login
//  @access public

module.exports.auth_user_login = async (req, res, next) => {
  const { email, password } = req.body.currentUser;
  try {
    const userLogin = await user.login(email, password);
    GenerateUserToken(res, userLogin._id);
    res.status(200).json({
      user: userLogin,
      message: "Welcome Back",
      state: true,
    });
  } catch (err) {
    res.send({ error: err });
    console.log(err);
  }
};
// ⭐
// @desc auth user Logout - delete token
// @desc POST /user/logout
// @access public
module.exports.user_logout = asyncHandler(async (req, res, next) => {
  res.cookie(process.env.USER_TOKEN, "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ state: false, message: "Logged out" });
});
// ⭐
// @desc auth user profile
// @desc POST /user/profile
// @access Private
module.exports.user_profile = asyncHandler(async (req, res, next) => {
  res.status(200).json({ user: req.user, state: true });
});
// ⭐
// @desc auth user update profile
// @desc POST /user/updateProfile
// @access Private
module.exports.user_update_profile = asyncHandler(async (req, res, next) => {
  const loggeduser = await user.findById(req.user._id);
  if (loggeduser) {
    loggeduser.firstName = req.body.data.firstName || loggeduser.firstName;
    loggeduser.lastName = req.body.data.lastName || loggeduser.lastName;
    loggeduser.image = req.body.data.image;
    loggeduser.email = req.body.data.email || loggeduser.email;
    loggeduser.theme = req.body.data.theme || loggeduser.theme;
    if (req.body.data.password) {
      loggeduser.password = req.body.data.password;
      loggeduser.confirmPassword = req.body.data.confirmPassword;
    }
    const loggedSave = await loggeduser.save();
    res.status(200).json({ user: loggedSave, message: "Edited", state: true });
  } else {
    res.status(404);
    throw new Error("user is not found");
  }
});
// ⭐
// @desc auth user add remove cart
// @desc POST /user/cart
// @access Private
module.exports.user_add_remove_cart = async (req, res, next) => {
  const { order } = req.body;
  const result = await user.findById(req.user._id);
  try {
    const { cart } = result;
    const cartItems = cart.map((item) => item);
    const alreadyAdded = await cartItems.find(
      (i) => i.order.itemDetails._id === order.itemDetails._id
    );
    if (alreadyAdded) {
      if (order.quantity >= 1) {
        const index = cart.indexOf(alreadyAdded);
        await user.updateOne(
          { _id: req.user._id },
          { $pull: { cart: cart[index] } }
        );
        await user.updateMany({ $push: { cart: { order } } });
        await result.save();
        const newResult = await user.findById(req.user._id);
        res.status(200).json({
          message: "modified",
          user: newResult,
          state: true,
        });
        return;
      } else {
        const index = cart.indexOf(alreadyAdded);
        await user.updateOne(
          { _id: req.user._id },
          { $pull: { cart: cart[index] } }
        );

        await result.save();
        const newResult = await user.findById(req.user._id);

        res.status(200).json({
          message: "removed from cart",
          user: newResult,
          state: true,
        });
        return;
      }
    } else {
      await user.updateMany({ $push: { cart: { order } } });
      await result.save();
      const newResult = await user.findById(req.user._id);
      res.status(200).json({
        message: "added to cart",
        user: newResult,
        state: true,
      });

      return;
    }
  } catch (err) {
    console.log(err);
  }
};
// ⭐
// @desc auth user remove cart
// @desc POST /user/cart
// @access Private
module.exports.user_remove_cart = async (req, res, next) => {
  const { order } = req.body;
  const result = await user.findById(req.user._id);
  try {
    const { cart } = result;
    const cartItems = cart.map((item) => item);
    const alreadyAdded = await cartItems.find(
      (i) => i.order.itemDetails._id === order
    );
    if (alreadyAdded) {
      const index = cart.indexOf(alreadyAdded);
      await user.updateOne(
        { _id: req.user._id },
        { $pull: { cart: cart[index] } }
      );

      await result.save();
      const newResult = await user.findById(req.user._id);

      res.status(200).json({
        message: "removed from cart",
        user: newResult,
        state: true,
      });
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
// ⭐
// @desc auth user total cart
// @desc POST /user/total
// @access Private
module.exports.user_cart = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user.cart);
});
module.exports.user_total_cart = asyncHandler(async (req, res, next) => {
  const result = await user.findById(req.user._id).select("cart");
  const cart = result.cart;
  const items = await oneItem.find({ _id: { $in: cart } });
  const eachPrice = items.map((item) => item.Price);
  const total = eachPrice.reduce((a, b) => a + b, 0);
  res.status(200).json({ totalPrice: total });
});
// ⭐
// @desc auth user add remove wishlist
// @desc POST /user/wishlist
// @access Private
module.exports.user_add_remove_wishlist = asyncHandler(
  async (req, res, next) => {
    const { orderId } = req.body;
    const result = await user.findById(req.user._id);
    try {
      const { wishlist } = result;
      const alreadyAdded = await wishlist.find((i) => i === orderId);
      if (alreadyAdded) {
        await user.updateMany({ $pull: { wishlist: orderId } });
        await result.save();
        const newResult = await user.findById(req.user._id);
        res.status(200).json({
          message: "removed from wishlist",
          userOrders: newResult.wishlist,
          state: true,
        });
        return;
      } else {
        await user.updateMany({ $push: { wishlist: orderId } });
        await result.save();
        const newResult = await user.findById(req.user._id);
        res.status(200).json({
          message: "added to wishlist",
          data: newResult.wishlist,
          state: true,
        });

        return;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// ⭐
// @desc auth user wishlist
// @desc POST /user/wishlist
// @access Private
module.exports.user_wishlist = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user.wishlist);
});

// ⭐
// @desc auth user confirm Order
// @desc POST /user/order
// @access Private
module.exports.user_confirm_order = asyncHandler(async (req, res, next) => {
  const orderDetails = await user
    .findById(req.user._id)
    .select(["firstName", "lastName", "email", "cart"]);
  // console.log(orderDetails);
  if (orderDetails.cart.length === 0) {
    res.status(200).json({
      state: false,
      message: "empty cart",
    });
  } else {
    // total price
    const cartArr = orderDetails.cart;
    // const cartId = cartArr.map((data) => data.order.itemDetails._id);

    // oneItem Database //
    // const items = await oneItem.find({ _id: { $in: cartId } });
    // const eachPrice = items.map((item) => item.Price);
    // const totalPrice = eachPrice.reduce((a, b) => a + b, 0);
    //
    //start payment
    //
    const lineItems = cartArr.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.order.itemDetails.ItemName,
        },
        unit_amount: item.order.itemDetails.Price * 100,
      },
      quantity: item.order.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.ORIGIN}/success`,
      cancel_url: "https://www.google.com",
    });
    //
    //end paymen
    //

    // console.log(session);
    try {
      if (session.id) {
        // payment_status: 'unpaid',
        const darr = await order.create({
          orderDetails,
          totalPrice: session.amount_total / 100,
          payment: session.payment_status,
          _sessionId: `${session.id}`,
        });

        res.status(200).json({
          url: session.url,
          // user: result,
          session: session,
          message: "Checkedout",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// @desc auth user item
// @desc POST /user/item
// @access public
module.exports.user_item = asyncHandler(async (req, res, next) => {
  const menuItems = await oneItem.find({});
  //
  res.status(200).json({ menuItems: menuItems });
});

// @desc auth user get item
// @desc POST /user/getItem
// @access Private
module.exports.user_get_item = asyncHandler(async (req, res, next) => {
  const item = await oneItem.findById({
    _id: req.body.id,
  });
  //
  res.status(200).json({ data: item });
});

// @desc auth user seccess page
// @desc POST /user/paidSuccessfully
// @access Private
module.exports.user_orders = asyncHandler(async (req, res, next) => {
  const orders = await order.find({});
  const isAcceptedOrder = orders.filter((i) => {
    return (
      i.accepted === true &&
      i.orderDetails._id.toString() === req.user._id.toString()
    );
  });
  res.status(200).json({ data: isAcceptedOrder });
});
// @desc auth user seccess page
// @desc POST /user/paidSuccessfully
// @access Private
module.exports.user_success_order = asyncHandler(async (req, res, next) => {
  const User = await user.findByIdAndUpdate(
    { _id: req.user._id },
    { cart: [] }
  );
  const saved = User.save();
  const newResult = await user.findById(req.user._id);
  res.status(200).json({
    message: "Thank you",
    user: newResult,
    state: true,
  });
});

// @desc auth user fail page
// @desc POST /user/paymentFail
// @access Private
module.exports.user_fail_order = asyncHandler(async (req, res, next) => {
  const newResult = await user.findById(req.user._id);
  console.log(newI);
  res.status(200).json({
    message: "Payment Failed",
    user: newResult,
    state: true,
  });
});
