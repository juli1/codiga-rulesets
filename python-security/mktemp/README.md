Using insecure temporary files makes your program vulnerable to attacks. The official [Python documentation](https://docs.python.org/3/library/tempfile.html) reports this module being vulnerable to attacks. Instead of `mktemp`, use the secure version `mkstemp()`. 


**Learn More**

 - [CWE-377 - Insecure Temporary File](https://cwe.mitre.org/data/definitions/377.html)
 - [Python documentation for mktemp()](https://docs.python.org/3/library/tempfile.html)
