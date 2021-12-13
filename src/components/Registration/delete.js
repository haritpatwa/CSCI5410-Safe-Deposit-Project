var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let remove = function (boxName) {

    var params = {
        TableName: "User",
        Key: {
            "boxId": boxName
        }
    };
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("users::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::delete::success");
        }
    });
}

remove();