
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
const crypto = require("crypto");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf("7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w");

bot.hears("/login", (ctx) => {
  console.log("Bot heard /login");
  let optionalParams = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Login",
            login_url: {
              url: `${currentHost}/login`,
            },
          },
        ],
      ],
    },
  };
  ctx.reply("Click this button to login!", optionalParams);
  console.log("Bot replied to /login");
});

bot.hears("/start", (ctx) => {
  console.log("Bot heard /start");
  ctx.reply("Click /login or type it into the chat to begin login!");
  console.log("Bot replied to /start");
});

app.get("/login", (req, res) => {
  console.log("Logging in");
  if (checkSignature(req.query)) {
    // Data is authenticated
    res.send(`Welcome, ${req.query.first_name}! You have successfully logged in.`);
  } else {
    // Data is not authenticated
    res.status(403).send("Authentication failed");
  }
});

bot.use(Telegraf.log());

app.listen(9999, () => {
  console.log("Server started on port 9999");
  bot.launch();
});

// Function to check the Telegram login signature
function checkSignature({ hash, ...userData }) {
  const secretKey = crypto
    .createHash("sha256")
    .update("7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w")
    .digest();

  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

