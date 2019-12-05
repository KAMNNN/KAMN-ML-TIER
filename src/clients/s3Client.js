const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.getObject = async (params) => {
  return await s3.getObject(params).promise();
};
