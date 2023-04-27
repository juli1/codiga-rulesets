import ssl

def newconnect(self):
  try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    remote = ssl.wrap_socket(s,
                             ca_certs= CA,
                             cert_reqs=ssl.CERT_REQUIRED,
                             ssl_version = ssl.PROTOCOL_SSLv3)
    remote.connect(self.server.seradd)
    if not self.server.seradd[0] == remote.getpeercert()['subjectAltName'][0][1]:
      logging.error('Server crt error !! Server Name don\'t mach !!')
      logging.error(remote.getpeercert()['subjectAltName'][0][1])
      return
    if not self.send_PW(remote):
      logging.warn('PW error !')
      return
    except socket.error, e:
      logging.warn(e)
      return