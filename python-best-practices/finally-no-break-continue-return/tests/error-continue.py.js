try:
		client_obj.get_url(url)
except (URLError, ValueError):
		client_obj.remove_url(url)
except SocketTimeout:
		client_obj.handle_url_timeout(url)
finally:
		continue