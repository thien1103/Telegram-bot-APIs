const crypto = require("crypto");
const mysql = require("mysql2")

const BOT_TOKEN = "7296914438:AAGrJ4Sisw0h6oGYx5Ez4nMjtCOYhlfoW8w"; // place bot token of your bot here


const connection = mysql.createConnection({
  host: "mysql-startkid-startkid.d.aivencloud.com",
  port: "22394",
  user: "avnadmin",
  password: "AVNS_86ep1Mrtd_SBnm_AglI",
  database: "test_telegram_api_cloud",
});


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
  const { id, username, first_name, last_name } = authData;

  const query = `
    INSERT INTO user (id, username, first_name, last_name)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE username = ?, first_name = ?, last_name = ?
  `;

  connection.query(
    query,
    [id, username, first_name, last_name, username],
    (err, results) => {
      if (err) {
        console.error("Error saving user data:", err);
      } else {
        console.log("User data saved successfully:", results);
      }
    }
  );
}

module.exports = {saveTelegramUserData, checkTelegramAuthorization}
