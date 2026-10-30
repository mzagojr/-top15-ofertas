# TOP 15 OFERTAS — backend inicial

Servidor Node.js/Express para preparar a conexão OAuth com o Mercado Livre.

Rotas:
- `/` página inicial
- `/health` status
- `/oauth/start` inicia autorização
- `/oauth/callback` recebe retorno OAuth

Variáveis no Render:
- `ML_CLIENT_ID`
- `ML_CLIENT_SECRET`
- `ML_REDIRECT_URI` (idêntica à URI cadastrada no Mercado Livre)
- `NODE_ENV=production`

**Importante:** protótipo inicial. O token fica apenas na memória do servidor e se perde em reinicializações. Antes de uso contínuo, implementar armazenamento seguro e renovação do refresh token. Nunca coloque o Client Secret no GitHub.
