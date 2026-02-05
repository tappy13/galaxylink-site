# Galaxy Link — Local Test Environment

Quick steps to run the site locally.

Prerequisites
- Node.js (14+) or Python 3 (optional).

Node (recommended)
1. Open a terminal in this folder.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open http://localhost:8080 in your browser. The server serves `galaxy_index_final.html` by default.

Python (quick alternative)

```powershell
# From this folder
python -m http.server 8080
# then open http://localhost:8080/galaxy_index_final.html
```

Notes
- The server defaults to serving `galaxy_index_final.html` at the root. To access other pages, navigate to them directly:
  - `http://localhost:8080/laptops_desktops_page.html`
  - `http://localhost:8080/backup_cloud_page.html`
  - `http://localhost:8080/access_control_page.html`
- HTML files reference `styles.css` and `script.js`. You can rename the final files to these names if needed, or modify the script/link tags in the HTML files.
- To serve a different page from the root, edit the fallback route in `server.js`.