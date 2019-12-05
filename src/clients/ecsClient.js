const AWS = require('aws-sdk');
const ecs = new AWS.ECS();

exports.runTask = async (params) => {
	return await ecs.runTask(params).promise();
};
