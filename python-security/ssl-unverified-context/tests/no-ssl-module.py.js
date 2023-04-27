import xmlrpclib

test = xmlrpclib.ServerProxy('https://admin:bz15h9v9n@localhost:9999/API',
                             verbose=False, use_datetime=True, 
                             context=ssl._create_unverified_context())
test.list_satellites()