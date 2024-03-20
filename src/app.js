const express = require("express");
require("./configuration/index.js");
const route = require("./route/index.js");
const billService = require("./service/BillService.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use('/', route)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});