import boto3

client = boto3.Session(
    's3',
    aws_session_token=SESSION_TOKEN
)