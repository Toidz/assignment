const express = require("express");
require('dotenv').config()

const app = express();
const port = 3764;

const path = require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");
app.use(express.static(path.join(__dirname,"public")));

const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIE_PAR));

const database = require("./config/database");
database.connect();

app.use(express.json());
const adminRouter= require("./router/admin/index.route")
app.use(`/`,adminRouter);

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});