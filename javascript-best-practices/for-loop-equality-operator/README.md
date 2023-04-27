Testing a `for` loop termination using an equality operator (`==` or `!=`) is dangerous because it could set up an infinite loop.

Consider using comparison operators, less than (`<`) or greater than (`>`), to decrease the likelihood you accidentally write an infinite loop.

Equality operators are ignored when the right side of the test is `null`.