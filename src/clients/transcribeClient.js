const AWS = require('aws-sdk');
const transcribe = new AWS.TranscribeService();

exports.startTranscriptionJob = async (params) => {
	return await transcribe.startTranscriptionJob(params).promise();
};
