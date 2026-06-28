function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <h1>GitHub OAuth ainda não configurado</h1>
      <p>Adicione a variável <code>GITHUB_CLIENT_ID</code> na Vercel e faça redeploy.</p>
    `);
    return;
  }

  const origin = getOrigin(req);
  const redirectUri = `${origin}/api/callback`;
  const state = req.query.state || "decap-cms";
  const scope = process.env.GITHUB_SCOPE || "repo";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
  });
  res.end();
};
