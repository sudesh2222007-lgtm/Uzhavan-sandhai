const express = require(" express\);
const app = express();
app.use(express.json());
app.all(\*\; (req, res) => res.json({ success: true, message: \API running\ }));
module.exports = app;
