
// // server.js
// const express = require("express");
// const bodyParser = require("body-parser");
// const { Telegraf } = require("telegraf");
// require("dotenv").config();
// const { getInvoiceData, saveInvoiceData } = require("./models/invoiceModel");

// const app = express();
// const bot = new Telegraf(process.env.BOT_TOKEN);

// app.use(bodyParser.json());

// bot.use(Telegraf.log());

// bot.hears("/start", (ctx) => {
//   return ctx.sendMessage("Welcome to our shop. Choose as you please.");
// });

// bot.hears("/pay", async (ctx) => {
//   const invoiceData = await getInvoiceData(ctx.from.id);

//   if (!invoiceData) {
//     return ctx.reply("No invoice data found for your account.");
//   }

//   const invoice = {
//     chat_id: ctx.from.id,
//     title: invoiceData.title,
//     description: `${invoiceData.description}`,
//     currency: invoiceData.currency,
//     prices: [{ label: invoiceData.price_label, amount: invoiceData.amount }],
//     photo_url: invoiceData.photo_url,
//     photo_width: 640,
//     photo_height: 640,
//     start_parameter: "get_access",
//     payload: {},
//   };

//   return ctx.replyWithInvoice(invoice);
// });

// bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

// bot.on("successful_payment", async (ctx, next) => {
//   await ctx.reply("Thank you for your purchase!");
// });

// bot.launch();

// // Endpoint to save user information into the database
// app.post("/save-invoice", async (req, res) => {
//   try {
//     const {
//       chat_id,
//       title,
//       description,
//       photo_url,
//       currency,
//       price_label,
//       amount,
//     } = req.body;

//     if (
//       !chat_id ||
//       !title ||
//       !description ||
//       !photo_url ||
//       !currency ||
//       !price_label ||
//       !amount
//     ) {
//       return res.status(400).send("All fields are required");
//     }

//     await saveInvoiceData(req.body);
//     res.status(200).send("Invoice data saved successfully");
//   } catch (error) {
//     console.error("Error processing invoice:", error);
//     if (error.message) {
//       res
//         .status(500)
//         .send(`Error saving invoice data: ${error.message}`);
//     } else {
//       res.status(500).send("Internal server error");
//     }
//   }
// });

// const PORT = process.env.PORT || 4040;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// // // server.js
// // const express = require("express");
// // const bodyParser = require("body-parser");
// // const { Telegraf } = require("telegraf");
// // require("dotenv").config();
// // const { getInvoiceData, saveInvoiceData } = require("./models/invoiceModel");

// // const app = express();
// // const bot = new Telegraf(process.env.BOT_TOKEN);

// // app.use(bodyParser.json());

// // bot.use(Telegraf.log());

// // bot.hears("/start", (ctx) => {
// //   return ctx.sendMessage("Welcome to our shop. Choose as you please.");
// // });

// // bot.hears("/pay", async (ctx) => {
// //   const invoiceData = await getInvoiceData(ctx.from.id);

// //   if (!invoiceData) {
// //     return ctx.reply("No invoice data found for your account.");
// //   }

// //   const invoice = {
// //     chat_id: ctx.from.id,
// //     title: invoiceData.title,
// //     description: invoiceData.description,
// //     currency: invoiceData.currency,
// //     prices: [{ label: invoiceData.price_label, amount: invoiceData.amount }],
// //     photo_url: invoiceData.photo_url,
// //     photo_width: 640,
// //     photo_height: 640,
// //     start_parameter: "get_access",
// //     payload: {},
// //   };

// //   return ctx.replyWithInvoice(invoice);
// // });

// // bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

// // bot.on("successful_payment", async (ctx, next) => {
// //   await ctx.reply("Thank you for your purchase!");
// // });

// // bot.launch();

// // // Endpoint to save user information into the database
// // app.post("/save-invoice", async (req, res) => {
// //   try {
// //     const {
// //       chat_id,
// //       title,
// //       description,
// //       photo_url,
// //       currency,
// //       price_label,
// //       amount,
// //     } = req.body;

// //     if (
// //       !chat_id ||
// //       !title ||
// //       !description ||
// //       !photo_url ||
// //       !currency ||
// //       !price_label ||
// //       !amount
// //     ) {
// //       return res.status(400).send("All fields are required");
// //     }

// //     await saveInvoiceData(req.body);
// //     res.status(200).send("Invoice data saved successfully");
// //   } catch (error) {
// //     console.error("Error processing invoice:", error);
// //     if (error.message) {
// //       res.status(500).send(`Error saving invoice data: ${error.message}`);
// //     } else {
// //       res.status(500).send("Internal server error");
// //     }
// //   }
// // });

// // const PORT = process.env.PORT || 4040;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { handleLogout, renderPage } = require("./login_example");
const {
  checkTelegramAuthorization,
  saveTelegramUserData,
} = require("./authorization");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/login_example", renderPage);
app.get("/check_authorization", (req, res) => {
  try {
    const authData = checkTelegramAuthorization(req.query);
    saveTelegramUserData(authData, res);
    res.redirect("/login_example");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.get("/logout", handleLogout);

app.listen(9999, () => {
  console.log("Server is running on port 9999");
});