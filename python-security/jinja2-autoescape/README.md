By default, jinja2 is not autoescaping. This can lead to XSS attacks. The `autoescape` parameter should always be `True`.


**Learn More**

 - [OWASP XSS](https://owasp.org/www-community/attacks/xss/)
 - [CWE-94 - Improper Control of Generation of Code](https://cwe.mitre.org/data/definitions/94.html)