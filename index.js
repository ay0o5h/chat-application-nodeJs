const express = require("express");
const config = require("./config");
const router = require('./routes/v1')
const bodyParser = require('body-parser')
const {notFound}  = require('./middlewares/notFound');
const cors = require('cors')
const app = express();

const port = config.port || 3002

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)
 app.use(notFound);
app.listen(port, () => {
    console.log(`running on port ${port}`)
})
