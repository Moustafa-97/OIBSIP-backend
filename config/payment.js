

// const stripe = require("stripe")(process.env.STIPE_SECRET_KEY);

// module.exports.lineItemsF = async (theArr,name, unitAmount, quantity) => {
//   const lineItems = theArr.map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: name,
//       },
//       unit_amount: unitAmount * 100,
//     },
//     quantity: quantity,
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     success_url: process.env.STIPE_SUCCESS,
//     cancel_url: process.env.STIPE_FAIL,
//   });
//   return { lineItems, session };
// };
