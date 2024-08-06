const crypto = require("crypto");

const BOT_TOKEN = "7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w"; // place bot token of your bot here

function checkTelegramAuthorization(authData) {
  const checkHash = authData.hash;
  delete authData.hash;

  const dataCheckArr = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`);
  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (hash !== checkHash) {
    throw new Error("Data is NOT from Telegram");
  }

  if (Date.now() / 1000 - authData.auth_date > 86400) {
    throw new Error("Data is outdated");
  }

  return authData;
}

function saveTelegramUserData(authData) {
  const authDataJson = JSON.stringify(authData);
  // Set a cookie named 'tg_user' with the authDataJson value
  // Depending on your web framework, the method to set a cookie may vary
}

module.exports = {saveTelegramUserData, checkTelegramAuthorization}
