const express = require("express");
const config = require("./config");
const router = require('./routes/v1')
const bodyParser = require('body-parser')
const {notFound}  = require('./middlewares/notFound');
const cors = require('cors')
const app = express();
const http = require('http')
const port = config.port || 3002

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)
 app.use(notFound);
const server = http.createServer(app)
const SocketServer = require('./soket')
SocketServer(server)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
