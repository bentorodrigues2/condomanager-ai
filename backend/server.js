
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);
const condominiosRoutes = require("./routes/condominios");
app.use("/api/condominios", condominiosRoutes);
const fracoesRoutes = require("./routes/fracoes");
app.use("/api/fracoes", fracoesRoutes);
const proprietariosRoutes = require("./routes/proprietarios");
app.use("/api/proprietarios", proprietariosRoutes);
const despesasRoutes = require("./routes/despesas");
app.use("/api/despesas", despesasRoutes);
const assembleiasRoutes = require("./routes/assembleias");
app.use("/api/assembleias", assembleiasRoutes);
const documentosRoutes = require("./routes/documentos");
app.use("/api/documentos", documentosRoutes);
const pagamentosRoutes = require("./routes/pagamentos");
app.use("/api/pagamentos", pagamentosRoutes);
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);
const relatoriosRoutes = require("./routes/relatorios");
app.use("/api/relatorios", relatoriosRoutes);
const quotasRoutes = require("./routes/quotas");
app.use("/api/quotas", quotasRoutes);
const notificacoesRoutes = require("./routes/notificacoes");
app.use("/api/notificacoes", notificacoesRoutes);
const alertasRoutes = require("./routes/alertas");
app.use("/api/alertas", alertasRoutes);
const cobrancasRoutes = require("./routes/cobrancas");
app.use("/api/cobrancas", cobrancasRoutes);
const painelProprietarioRoutes = require("./routes/painelProprietario");
app.use("/api/proprietario/painel", painelProprietarioRoutes);
const fornecedoresRoutes = require("./routes/fornecedores");
app.use("/api/fornecedores", fornecedoresRoutes);
const ticketsRoutes = require("./routes/tickets");
app.use("/api/tickets", ticketsRoutes);
const reservasRoutes = require("./routes/reservas");
app.use("/api/reservas", reservasRoutes);
const documentosOperacionaisRoutes = require("./routes/documentosOperacionais");
app.use("/api/documentos-operacionais", documentosOperacionaisRoutes);
const pagamentosOnlineRoutes = require("./routes/pagamentosOnline");
app.use("/api/pagamentos-online", pagamentosOnlineRoutes);
const reconciliacaoRoutes = require("./routes/reconciliacao");
app.use("/api/reconciliacao", reconciliacaoRoutes);
const pushRoutes = require("./routes/push");
app.use("/api/push", pushRoutes);
const iaRoutes = require("./routes/ia");
app.use("/api/ia", iaRoutes);
const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "Backend CondoManager AI ativo" });
});

app.listen(3001, () => {
  console.log("🚀 Backend a correr na porta 3001");
});
