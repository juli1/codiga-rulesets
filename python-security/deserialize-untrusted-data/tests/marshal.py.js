import marshal
person = {"name":"xyz", "age":22, "marks":[45,56,78]}
data = marshal.dumps(person)
obj = marshal.loads(data)