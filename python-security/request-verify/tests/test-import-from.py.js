from requests import get
r = get(w, verify=False)
r = get(w, verify=False, timeout=10)