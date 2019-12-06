#!/usr/bin/python
import boto3
import nlpEngine
import json

print('Recieving sqs params..')

sqs = boto3.resource('sqs')
ecs_params_queue = sqs.get_queue_by_name(QueueName='ECSParameterQueue')

message = ecs_params_queue.receive_messages(MaxNumberOfMessages=1)[0]
params = json.loads(message.body)
message.delete()

session_id = params['session_id']

question = nlpEngine.generate_question(params['transcript'])

print('Starting question generation')

question_queue = sqs.get_queue_by_name(QueueName='{}.fifo'.format(session_id))

response = question_queue.send_message(
  MessageBody=question,
  MessageGroupId='messageGroup1'
)

print("Completed nlp task..")
