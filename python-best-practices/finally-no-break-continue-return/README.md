When using `return`, `break` or `continue` in a `finally` block, it will stop the spread of any exceptions that were thrown in the `try`, `else`, or `except` blocks and will disregard any return statements.

Learn more in the [official Python documentation](https://docs.python.org/3/reference/compound_stmts.html#except).