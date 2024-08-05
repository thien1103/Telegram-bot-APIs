
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
const bodyParser = require("body-parser");
const { Telegraf, Markup } = require("telegraf");
const crypto = require("crypto");
const path = require("path");

const app = express();
const bot = new Telegraf("7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w");
const SECRET_KEY = "7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w"; // Use the token you got from BotFather

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("client"));

// Endpoint to serve the authentication HTML page
app.get("/auth", (req, res) => {
  res.sendFile("index.html");
});

// Endpoint to handle the Telegram authentication redirect
app.get("/auth/redirect", (req, res) => {
  const { id, first_name, last_name, username, photo_url, auth_date, hash } =
    req.query;

  // Verify the integrity of the data
  const dataCheckString = `id=${id}&first_name=${first_name}&last_name=${last_name}&username=${username}&photo_url=${photo_url}&auth_date=${auth_date}`;
  const expectedHash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(dataCheckString)
    .digest("hex");

  if (hash !== expectedHash) {
    return res.status(403).send("Invalid authentication data");
  }

  // At this point, you can save the user's information or perform any other necessary actions
  console.log("User authenticated:", {
    id,
    first_name,
    last_name,
    username,
    photo_url,
    auth_date,
  });

  // Send a response to the client
  res.send("Authentication successful!");
});

// Start the bot and server
bot.start((ctx) => {
  const token = crypto.randomBytes(16).toString("hex");
  const authUrl = `https://some-client-file-on-render.onrender.com/auth/redirect?token=${token}&userId=${ctx.from.id}`;

  ctx.reply(
    "Welcome! Please log in using the button below:",
    Markup.inlineKeyboard([Markup.button.url("Log in with Telegram", authUrl)])
  );
});

bot.launch();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});