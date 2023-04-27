import stat

path = "/path/to/file"
os.chmod(path, stat.S_IROTH | stat.S_IWOTH | stat.S_IXOTH)