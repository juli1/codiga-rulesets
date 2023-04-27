Avoid deserialization of unstrusted YAML data via potential unsafe `yaml.load`.

This rule checks that the `yaml` module is used and the `load` method is used. It recommends the usage of `safe_load` that prevents unsafe deserialization.

**See Also**

 - [CWE-502 - Deserialization of Untrusted Data](https://cwe.mitre.org/data/definitions/502.html)