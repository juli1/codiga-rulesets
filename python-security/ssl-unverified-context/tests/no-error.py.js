import xmlrpclib
import ssl

test = xmlrpclib.ServerProxy('https://admin:bz15h9v9n@localhost:9999/API',
                             verbose=False, use_datetime=True)
test.list_satellites()