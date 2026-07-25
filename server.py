import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = "dist"

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # If requested path is a file (e.g. .css, .js, .png), serve normally
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            # Fallback to index.html for SPA routes like /presell, /home
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
        print(f"🚀 Servidor SPA ativo em http://localhost:{PORT}")
        print(f"📍 Rotas disponíveis: http://localhost:{PORT}/#/presell e http://localhost:{PORT}/#/home")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor finalizado.")
