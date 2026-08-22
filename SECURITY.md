# Security policy

DSH Plugin Bench reads untrusted plugin source and metadata but does not install or execute target code during its default static scan.

## Report a vulnerability

Do not put exploit details, credentials, private repository URLs, or user data in a public issue.

When this project has a public GitHub remote, use the repository Security tab and private vulnerability reporting. If private reporting is unavailable, open a minimal issue that requests a private contact channel without including sensitive details.

Include the affected version, supported input shape, expected boundary, observed behavior, and a minimal redacted reproduction. Reports about theoretical inputs outside the documented DSH/plugin contracts may be closed as out of scope.

## Supported version

Until the first public release, only the current `main` commit is supported. This statement must be updated when versioned releases begin.
