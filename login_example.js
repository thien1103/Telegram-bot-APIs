const BOT_USERNAME = "haothien_test_payment_bot"; // place username of your bot here

function getTelegramUserData(req) {
  const authDataJson = req.cookies.tg_user;
  if (authDataJson) {
    const authData = JSON.parse(decodeURIComponent(authDataJson));
    return authData;
  }
  return false;
}

function handleLogout(req, res) {
  res.clearCookie("tg_user");
  res.redirect("/login_example");
}

function renderPage(req, res) {
  const tgUser = getTelegramUserData(req);
  let html;
  if (tgUser !== false) {
    const firstName = htmlEscape(tgUser.first_name);
    const lastName = htmlEscape(tgUser.last_name);
    if (tgUser.username) {
      const username = htmlEscape(tgUser.username);
      html = `<h1>Hello, <a href="https://t.me/${username}">${firstName} ${lastName}</a>!</h1>`;
    } else {
      html = `<h1>Hello, ${firstName} ${lastName}!</h1>`;
    }
    if (tgUser.photo_url) {
      const photoUrl = htmlEscape(tgUser.photo_url);
      html += `<img src="${photoUrl}">`;
    }
    html += '<p><a href="?logout=1">Log out</a></p>';
  } else {
    html = `
<h1>Hello!</h1>
<script async src="https://telegram.org/js/telegram-widget.js?22" lang="en" data-telegram-login="${BOT_USERNAME}" data-size="large" data-auth-url="/check_authorization"></script>
`;
  }

  res.render("login_example", { html });
}

function htmlEscape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  handleLogout,
  renderPage,
};
