const express = require('express');
const cors = require('cors');
const guardasRoutes = require('./routes/guardas');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/guardas', guardasRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
