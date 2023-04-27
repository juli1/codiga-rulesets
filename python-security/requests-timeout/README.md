Access to remote resources should always use a timeout and appropriately handle the timeout and recovery. When using `requests.get`, `requests.put`, `requests.patch`, etc. - we should always use a `timeout` as an argument.


**Learn More**

 - [CWE-1088](https://cwe.mitre.org/data/definitions/1088.html) - Synchronous Access of Remote Resource without Timeout
 - [Python Best Practices: always use a timeout with the requests library
](https://www.codiga.io/blog/python-requests-timeout/)