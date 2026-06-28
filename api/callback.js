function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function renderCallback(status, content) {
  const payload = JSON.stringify(content).replace(/</g, "\\u003c");
  const isSuccess = status === "success";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>GitHub authorization</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 40px;
      line-height: 1.5;
      color: #222;
    }
    code {
      background: #f2f2f2;
      padding: 2px 5px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>${isSuccess ? "Autorização concluída" : "Erro na autorização"}</h1>
  <p id="message">${isSuccess ? "Voltando para o painel..." : "Não foi possível concluir o login."}</p>
  ${isSuccess ? "" : `<pre>${payload}</pre>`}

  <script>
    (function () {
      var authMessage = 'authorization:github:${status}:${payload}';
      var sent = false;

      function sendToOpener(targetOrigin) {
        if (!window.opener) {
          document.getElementById('message').innerHTML = 'Esta janela não foi aberta pelo painel. Feche esta janela e tente entrar novamente pelo <code>/admin</code>.';
          return;
        }
        try {
          window.opener.postMessage(authMessage, targetOrigin || '*');
          sent = true;
        } catch (error) {
          console.error(error);
        }
      }

      function receiveMessage(event) {
        sendToOpener(event.origin || '*');
        window.removeEventListener('message', receiveMessage, false);
        ${isSuccess ? "setTimeout(function () { window.close(); }, 900);" : ""}
      }

      window.addEventListener('message', receiveMessage, false);

      if (window.opener) {
        // Standard Decap/Netlify CMS handshake: ask the admin window for its origin first.
        window.opener.postMessage('authorizing:github', '*');

        // Fallback: some browser contexts do not answer the handshake.
        // This still posts from the same site origin, which Decap can accept.
        setTimeout(function () { if (!sent) sendToOpener('*'); }, 800);
        setTimeout(function () { if (!sent) sendToOpener('*'); }, 1800);

        ${isSuccess ? "setTimeout(function () { window.close(); }, 3500);" : ""}
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
    res.end(renderCallback("error", {
      error,
      error_description: req.query.error_description || "GitHub authorization failed."
    }));
    return;
  }

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end(renderCallback("error", {
      error: "missing_environment_variables",
      error_description: "GITHUB_CLIENT_ID e/ou GITHUB_CLIENT_SECRET não foram configurados na Vercel."
    }));
    return;
  }

  if (!code) {
    res.statusCode = 400;
    res.end(renderCallback("error", {
      error: "missing_code",
      error_description: "GitHub não retornou um código de autorização."
    }));
    return;
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ronaldogomesjr-decap-cms-oauth"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const result = await tokenResponse.json();

    if (!tokenResponse.ok || result.error || !result.access_token) {
      res.statusCode = 200;
      res.end(renderCallback("error", {
        error: result.error || "token_exchange_failed",
        error_description: result.error_description || "Não foi possível obter o token do GitHub."
      }));
      return;
    }

    res.statusCode = 200;
    res.end(renderCallback("success", {
      token: result.access_token,
      provider: "github"
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(renderCallback("error", {
      error: "server_error",
      error_description: err.message || "Erro inesperado no OAuth."
    }));
  }
};
