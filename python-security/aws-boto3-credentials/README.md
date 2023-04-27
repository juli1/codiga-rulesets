This rule makes sure that the `boto3` library use the environments variables to authenticate instead of using hardcoded credentials. This rule checks for the `boto3.client` and `boto3.Session` calls. It addresses the [CWE-798 rule](https://cwe.mitre.org/data/definitions/798.html) - uses of hardcoded credentials in code.


** Learn More **

 - [AWS credentials](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials)
 - [CWE-798: Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html)