const express = require("express");

require("./configuration/EnvironmentVariable.js");
const firestore = require("./persistency/Firestore.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const docRef = firestore.collection("Admin");
  docRef.get().then((doc) => {
    doc.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  });
});
