'use strict'

const s3Client = require('./clients/s3Client');
const transcribeClient = require('./clients/transcribeClient');
const ecsClient = require('./clients/ecsClient');
const textBucket = process.env.TEXT_BUCKET;

exports.startTranscriptionJob = async (event, context, callback) => {
	console.log('Starting Transcription Job..');
  const bucket = event.Records[0].s3.bucket.name;
	const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
	const params = {Bucket: bucket, Key: key};
  var response;
	try {
	  const s3URL = `https://s3.amazonaws.com/${bucket}/${key}`;
		const jobName = key.replace('/', '-');
    const params = {
			LanguageCode: 'en-US',
			Media: {
				MediaFileUri: s3URL + ""
		  },
			MediaFormat: 'mp3',
			TranscriptionJobName: jobName,
			OutputBucketName: textBucket 
	  };
		response = await transcribeClient.startTranscriptionJob(params); 
    console.log(response);
	} catch (err) {
		console.log(err);
		response = err;
	}
  callback(null, response);
};

exports.startQuestionGenerationFunction = async (event, context, callback) => {
	console.log('Starting Question Generation Task..');
  const bucket = event.Records[0].s3.bucket.name;
	var response;
	const params = {
    taskDefinition: process.env.TASK_DEFINITION,
		cluster: process.env.ECSCluster,
    launchType: 'FARGATE',
    networkConfiguration: {
			awsvpcConfiguration: {
				subnets: [
					process.env.SUBNET_ONE,
					process.env.SUBNET_TWO
			  ],
				securityGroups: [
					process.env.SECURITY_GROUP
				]
			},
		}
	};
	try {
		response = await ecsClient.runTask(params);
		console.log(response);
	} catch (err) {
		console.log(err);
		response = err;
	}
	callback(null, response);
};
