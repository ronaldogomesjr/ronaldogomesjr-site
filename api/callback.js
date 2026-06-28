function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function renderBody(status, content) {
  const safeContent = JSON.stringify(content).replace(/</g, "\\u003c");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autorizando GitHub...</title>
</head>
<body>
  <p>Autorizando GitHub...</p>
  <script>
    (function () {
      var message = 'authorization:github:${status}:${safeContent}';

      function receiveMessage(event) {
        if (window.opener) {
          window.opener.postMessage(message, event.origin);
        }
        window.removeEventListener('message', receiveMessage, false);
        window.close();
      }

      window.addEventListener('message', receiveMessage, false);

      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      } else {
        document.body.innerHTML = '<p>Autorização concluída. Você pode fechar esta janela.</p>';
      }
    })();
  </script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const code = req.query.code;
  const error = req.query.error;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (error) {
    res.statusCode = 200;
    res.end(renderBody("error", {
      error,
      error_description: req.query.error_description || "GitHub authorization failed.",
    }));
    return;
  }

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end(renderBody("error", {
      error: "missing_environment_variables",
      error_description: "GITHUB_CLIENT_ID e/ou GITHUB_CLIENT_SECRET não foram configurados na Vercel.",
    }));
    return;
  }

  if (!code) {
    res.statusCode = 400;
    res.end(renderBody("error", {
      error: "missing_code",
      error_description: "GitHub não retornou um código de autorização.",
    }));
    return;
  }

  try {
    const origin = getOrigin(req);
    const redirectUri = `${origin}/api/callback`;

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ronaldogomesjr-decap-cms-oauth",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const result = await tokenResponse.json();

    if (!tokenResponse.ok || result.error || !result.access_token) {
      res.statusCode = 200;
      res.end(renderBody("error", {
        error: result.error || "token_exchange_failed",
        error_description: result.error_description || "Não foi possível obter o token do GitHub.",
      }));
      return;
    }

    res.statusCode = 200;
    res.end(renderBody("success", {
      token: result.access_token,
      provider: "github",
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(renderBody("error", {
      error: "server_error",
      error_description: err.message || "Erro inesperado no OAuth.",
    }));
  }
};
