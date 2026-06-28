module.exports = async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({
    ok: true,
    message: "API functions are working.",
    hasClientId: Boolean(process.env.GITHUB_CLIENT_ID),
    hasClientSecret: Boolean(process.env.GITHUB_CLIENT_SECRET)
  }));
};
