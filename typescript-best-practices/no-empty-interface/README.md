An empty interface is equivalent to an empty object (`{}`). 

Normally you cannot directly assign an object literal to a type when the object literal contains more properties than are specified in the type.  But in the case of an empty interface, this check is not done, and such assignments will be successful. The result is highly likely to confuse maintainers.