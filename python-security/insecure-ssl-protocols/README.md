The following security protocols should never be used in Python: `SSLv3`, `SSLv2`, `TLSv1`. For more details, read the [SSL module page](https://docs.python.org/3/library/ssl.html) of the official documentation.

The issue addresses the [CWE-757](https://cwe.mitre.org/data/definitions/757.html) - selection of less-secure algorithm during negotiation.

