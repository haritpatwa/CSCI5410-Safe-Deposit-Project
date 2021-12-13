var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function () {
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
                console.log(data.Item.line[0])
            }
        })
}


fetchOneByKey();