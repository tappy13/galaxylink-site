const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from repository root
app.use(express.static(path.join(__dirname)));

// Fallback: serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'galaxy_index_final.html'));
});

app.listen(port, () => {
  console.log(`Galaxy Link site running at http://localhost:${port}`);
});
