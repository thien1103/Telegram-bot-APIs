const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { handleLogout, renderPage } = require("./login_example.js");
const {
  checkTelegramAuthorization,
  saveTelegramUserData,
} = require("./authorization");
const path = require("path");
const { Telegraf } = require("telegraf");
const bot = new Telegraf("7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w");

// Set up the view engine
app.set("view engine", "ejs");
// Set the views directory to the root directory
app.set("views", path.join(__dirname, "."));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

bot.command("login", async (ctx) => {
  console.log("Bot received /login command");
  try {
    const loginUrl = `https://server-file-for-telegram-login.onrender.com/login_example`;
    await ctx.reply("Click the button to log in:", {
      reply_markup: {
        inline_keyboard: [[{ text: "Login", url: loginUrl }]],
      },
    });
  } catch (err) {
    console.error("Error handling /login command:", err);
    await ctx.reply("Sorry, there was an error processing your request.");
  }
  console.log("Button sent");
});

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

bot.launch();

app.listen(9999, () => {
  console.log("Server is running on port 9999");
});
