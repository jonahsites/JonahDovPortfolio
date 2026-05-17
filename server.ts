import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(distPath));
    
    // SPA fallback: handle all non-file routes by serving index.html
    app.get('*', (req, res) => {
      if (req.method === 'GET' && !req.path.includes('.')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
