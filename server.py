#!/usr/bin/env python3
import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "127.0.0.1"
PORT = 5000

class SimpleHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-type", content_type)
        self.end_headers()

    def log_message(self, format, *args):
        # Override default to use sys.stdout with flush
        msg = format % args
        sys.stdout.write("[Python Backend] %s\n" % msg)
        sys.stdout.flush()

    def do_GET(self):
        sys.stdout.write("[Python Backend] GET %s\n" % self.path)
        sys.stdout.flush()
        if self.path == "/ping":
            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok", "server": "python"}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "not found"}).encode())

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode()
        sys.stdout.write("[Python Backend] POST %s body=%s\n" % (self.path, body))
        sys.stdout.flush()
        if self.path == "/log":
            self._set_headers()
            self.wfile.write(json.dumps({"message": "log received"}).encode())
        elif self.path == "/analyze":
            self._set_headers()
            self.wfile.write(json.dumps({"status": "processing", "message": "Agent pipeline dispatched"}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "not found"}).encode())

if __name__ == "__main__":
    sys.stdout.write("[Python Backend] Starting on http://%s:%d\n" % (HOST, PORT))
    sys.stdout.flush()
    server = HTTPServer((HOST, PORT), SimpleHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.stdout.write("[Python Backend] Stopped.\n")
        sys.stdout.flush()
        server.server_close()
