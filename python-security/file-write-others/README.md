Make sure that programs do not let write permissions for all users. When using `os.chmod`, the user should never use `S_IWOTH` that gives the permission to all users to write the file on the filesystem.

Instead, this permission should be removed, and proper control access should be configured.

See the following related CWE:
 - [CWE-275](https://cwe.mitre.org/data/definitions/275.html) category - Permission Issues
 - [CWE-280](https://cwe.mitre.org/data/definitions/280.html) - Improper Handling of Insufficient Permissions or Privileges