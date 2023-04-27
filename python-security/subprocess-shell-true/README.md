Never invoke `subprocess.Popen` with `shell = True` leads to unnecessary privileges and access to the underlying execution runtime. Execution with `shell = True` should clearly be verified and checked for code in production.

**Learn More**

 - [CWE-250](https://cwe.mitre.org/data/definitions/250.html) - Execution with Unnecessary Privileges
 - [CWE-657](https://cwe.mitre.org/data/definitions/657.html) - Violation of Secure Design Principles