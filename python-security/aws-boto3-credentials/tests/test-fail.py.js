import boto3

client = boto3.client(
    's3',
    aws_access_key_id="AGPAFOOBAR",
    aws_secret_access_key="bar",
    aws_session_token=SESSION_TOKEN
)