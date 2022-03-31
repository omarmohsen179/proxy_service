const express = require('express')
const helmet = require('helmet');
const path = require("path");
const cors = require('cors');

const app = express();

// Load .env
require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "ui", "build")));

app.use('/ui', (req, res, next) => {
    res.sendFile(path.join(__dirname, "ui", "build", "index.html"));
});

const { SERVICES } = require('./services');

app.use(cors());

const { setupLogging } = require("./logging");
const { setupRateLimit } = require("./ratelimit");
const { setupProxies } = require("./proxy");


// Apply middlewares
setupLogging(app);
setupRateLimit(app, SERVICES);
setupProxies(app, SERVICES);

app.use(express.json());
app.use(helmet());


app.all('/*', (req, resp) => {
    return resp.send('Proxy Server is running');
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})
