const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json());

let oauthState = null;
let accessToken = null;
let refreshToken = null;

app.get("/", (req, res) => {
  res.send("TOP 15 OFERTAS - Servidor online!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    sistema: "TOP 15 OFERTAS"
  });
});

app.get("/oauth/start", (req, res) => {
  const clientId = process.env.ML_CLIENT_ID;
  const redirectUri = process.env.ML_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).send(
      "Configure ML_CLIENT_ID e ML_REDIRECT_URI no Render."
    );
  }

  oauthState = crypto.randomBytes(24).toString("hex");

  const url = new URL(
    "https://auth.mercadolivre.com.br/authorization"
  );

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", oauthState);

  res.redirect(url.toString());
});

app.get("/oauth/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || state !== oauthState) {
      return res.status(400).send("Autorização inválida.");
    }

    oauthState = null;

    const response = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.ML_CLIENT_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.ML_REDIRECT_URI
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        erro: "Falha na autorização",
        detalhes: data
      });
    }

    accessToken = data.access_token;
    refreshToken = data.refresh_token;

    res.send("Mercado Livre conectado ao TOP 15 OFERTAS!");
  } catch (error) {
    res.status(500).send("Erro ao conectar com Mercado Livre.");
  }
});

app.get("/status", (req, res) => {
  res.json({
    conectado: Boolean(accessToken),
    sistema: "TOP 15 OFERTAS"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
