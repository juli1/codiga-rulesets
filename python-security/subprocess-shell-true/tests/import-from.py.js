from subprocess import Popen
Popen('/bin/ls %s' % ('something',), shell=True)