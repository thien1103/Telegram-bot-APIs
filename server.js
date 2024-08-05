
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
const session = require("express-session");
const app = express();

const { Telegraf } = require("telegraf");
const bot = new Telegraf("7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w");

// Use sessions to manage user states
app.use(
  session({
    secret: "7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

bot.hears("/login", (ctx) => {
  let optionalParams = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Login",
            login_url: {
              url: `${host}/login`,
            },
          },
        ],
      ],
    }),
  };
  ctx.reply("Click this button to login!", optionalParams);
});

bot.hears("/start", (ctx) => {
  ctx.reply("Click /login or type it into the chat to begin login!");
});

app.get("/login", (req, res) => {
  if (checkSignature(req.query)) {
    // Data is authenticated
    req.session.user = req.query;
    res("Logged in");
  } else {
    // Data is not authenticated
    res.status(403).send("Authentication failed");
  }
});

bot.launch();
bot.use(Telegraf.log());

app.listen(9999, () => {
  console.log("Server started on port 9999");
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