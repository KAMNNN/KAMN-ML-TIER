'use strict'

const s3Client = require('./clients/s3Client');
const transcribeClient = require('./clients/transcribeClient');
const ecsClient = require('./clients/ecsClient');
const sqsClient = require('./clients/sqsClient');

const textBucket = process.env.TEXT_BUCKET;
const ecsParamsQueue = process.env.ECS_PARAMS_QUEUE;
const ecsCluster = 'KAMNML-Cluster';

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
    var response;
    const params = {
        taskDefinition: process.env.TASK_DEFINITION,
        cluster: ecsCluster,
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
        console.log('Getting transcript from s3..');
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const s3Params = {Bucket: bucket, Key: key};
        const obj = await s3Client.getObject(s3Params);
        const objJSON = JSON.parse(obj.Body.toString());
        console.log(`Transcript Recieved: ${obj.Body.toString()}`);

        console.log('Sending transcript to sqs as ecs param..');
        const transcript = objJSON.results.transcripts[0].transcript;
        console.log(transcript);
        const sqsMessage = { transcript: transcript, session_id: '4389' };
        const sqsParams = {
            QueueUrl: ecsParamsQueue,
            MessageBody: JSON.stringify(sqsMessage)
        };
        const sqsData = await sqsClient.sendMessage(sqsParams);

        console.log('Starting ecs task..');
        response = await ecsClient.runTask(params);
        console.log(response);
    } catch (err) {
        console.log(err);
        response = err;
    }
    callback(null, response);
};
