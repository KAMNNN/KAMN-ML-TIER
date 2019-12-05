#!/usr/bin/python
import boto3

session_id = '4389'
question = '3+7'
sqs = boto3.resource('sqs')
question_queue = sqs.get_queue_by_name(QueueName='4389.fifo')

response = question_queue.send_message(
  MessageBody=question,
  MessageGroupId='messageGroup1'
)

print("Hello from Docker")
