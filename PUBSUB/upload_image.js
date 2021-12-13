// Using multer as a supportive library
const util = require("util");
const Multer = require("multer");

// Processing the file
let processFile = Multer({
  storage: Multer.memoryStorage(),
}).single("file");

// Connection with file object and exporting the function
let file_object = util.promisify(processFile);
module.exports = file_object;
