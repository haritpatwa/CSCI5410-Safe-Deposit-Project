const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var multer = require("multer");

var upload = multer({ dest: "./upload/" });

//form-urlencoded

// for parsing multipart/form-data
app.use(upload.any());

app.use(cors());
app.use(bodyParser.json());

const boxRoute = require("./pubsub");

const { Storage } = require("@google-cloud/storage");
const processFile = require("./upload_image");
const { format } = require("util");
const storage = new Storage({ keyFilename: "assignment-2-csci5410.json" });

app.use("/box", boxRoute);

app.post("/result", async (req, res) => {
  const bucket = storage.bucket("ml-image-insights");

  const fileName = "result.txt";
  const file_in_bucket = bucket.file(fileName);
  var fileData = file_in_bucket.createReadStream();
  var boolean_result = "";
  fileData
    .on("data", function (tempData) {
      boolean_result = tempData;
    })
    .on("end", function () {
      console.log(boolean_result);
      res.send(boolean_result);
    });
});
module.exports = app;
