
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {
    var params = {
        TableName: "loginstatistics",
        Key: {
            "boxNumber": "12345678"
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var input = {

                "boxNumber": "12345678",
                "line": data.Item.line.concat(['Logged' + 'user:                       a' + '                    at: ' + '7/12/2021:18:50'])
            };
            var params = {
                TableName: "loginstatistics",
                Item: input
            };
            docClient.put(params, function (err, data) {

                if (err) {
                    console.log("users::save::error - " + JSON.stringify(err, null, 2));
                } else {
                    console.log("users::save::success");
                }
            });
        }
    })



}

save();