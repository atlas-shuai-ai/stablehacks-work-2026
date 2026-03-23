import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "/root/.openclaw/workspace"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving dashboard at port {PORT}")
    httpd.serve_forever()
