We should never pass an empty array parameter to a function. Instead, use `None` and check the value if defined. This can cause unwanted behavior as the value of the argument is only evaluated once.

**Read more**

 - [Avoid using empty list as default argument](https://nikos7am.com/posts/mutable-default-arguments/)