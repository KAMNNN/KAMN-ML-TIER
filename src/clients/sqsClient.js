const AWS = require('aws-sdk');
const sqsClient = new AWS.SQS();

exports.sendMessage = async (params) => {
	console.log('Sending Message to SQS..');
	return await sqsClient.sendMessage(params).promise();
};

