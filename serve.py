import http.server
import socketserver
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Resolve filesystem path for requested URL
        fs_path = self.translate_path(self.path)

        # If path exists and is a file, serve normally
        if os.path.exists(fs_path) and not os.path.isdir(fs_path):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # If it's a directory with index.html, serve that
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, 'index.html')
            if os.path.exists(index):
                self.path = os.path.join(self.path, 'index.html')
                return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Fallback: serve root index.html for SPA routes
        self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Serving SPA at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nShutting down server')
            httpd.server_close()
