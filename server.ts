import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parser for JSON content
  app.use(express.json());

  // API Route: Handle incoming contact submissions
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    try {
      // Create readable summary contents
      const textContent = `
Name: ${name}
Email: ${email}
Subject: ${subject || "No Subject"}

Message:
${message}
      `;

      const htmlContent = `
        <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #fff;">
          <h2 style="color: #0066FF; margin-top: 0; font-family: system-ui, -apple-system; text-transform: uppercase; font-size: 16px; letter-spacing: 0.1em;">New Inquiry – Graphics by JD</h2>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin-bottom: 20px; margin-top: 10px;" />
          <p style="margin: 8px 0; font-size: 14px;"><strong>From Name:</strong> ${name}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #0066FF; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Subject:</strong> ${subject || "No Subject"}</p>
          <div style="background-color: #f7f9fc; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0066FF;">
            <p style="white-space: pre-wrap; margin: 0; line-height: 1.6; font-size: 14px; color: #333;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #999; margin-top: 25px; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px;">
            This email was sent from your portfolio website's contact form.
          </p>
        </div>
      `;

      // 1. Try sending via Web3Forms if Access Key is configured (Zero SMTP setup required)
      const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || "10b93509-dca1-440d-8f8b-234be908df7c";
      if (web3FormsKey) {
        try {
          const web3Response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Origin": "https://graphicsbyjd.com",
              "Referer": "https://graphicsbyjd.com/"
            },
            body: JSON.stringify({
              access_key: web3FormsKey,
              name: name,
              email: email,
              subject: `[Graphics by JD] ${subject || "New Inquiry Details"}`,
              message: message, // Use the actual message string directly
              from_name: "Graphics by JD Portfolio",
              // Optional but helpful fields
              source: "Portfolio Contact Form"
            })
          });

          const web3Data = await web3Response.json().catch(() => ({}));
          
          if (web3Response.ok && web3Data.success === true) {
            console.log(`[Email Delivered] From: ${name} via Web3Forms. Response:`, web3Data);
            return res.json({ success: true, method: "web3forms" });
          } else {
            console.error("Web3Forms API returned error or failure status:", web3Data, "HTTP Status:", web3Response.status);
          }
        } catch (web3Err) {
          console.error("Failed to forward to Web3Forms:", web3Err);
        }
      }

      // 2. Try sending via standard SMTP Server if configured
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || "587"),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"${name} via Graphics by JD" <${smtpUser}>`,
          to: "jadovdav@gmail.com",
          replyTo: email,
          subject: `[Graphics by JD] ${subject || "New Inquiry from " + name}`,
          text: textContent,
          html: htmlContent,
        });

        console.log(`[Email Delivered] From: ${name} via SMTP.`);
        return res.json({ success: true, method: "smtp" });
      }

      // 3. Fallback database: Save locally in messages.json so NO client message is ever dropped or lost
      const messagesPath = path.join(process.cwd(), "messages.json");
      let messages = [];
      try {
        const rawData = await fs.readFile(messagesPath, "utf-8");
        messages = JSON.parse(rawData);
      } catch (err) {
        // File does not exist yet compiles empty
      }

      messages.push({
        id: Date.now().toString(),
        name,
        email,
        subject: subject || "",
        message,
        createdAt: new Date().toISOString()
      });

      await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
      console.log(`[Contact Backed Up] From: ${name} (${email}) saved safely directly to messages.json workspace root.`);

      return res.json({
        success: true,
        method: "local_storage",
        message: "Your message has been captured safely. (Notice: SMTP & Web3Forms are not yet configured in environment variables, but your message is securely backed up server-side in messages.json at the root of the project)."
      });

    } catch (err: any) {
      console.error("Contact form processing error:", err);
      return res.status(500).json({ error: "Failed to dispatch message or back up: " + err.message });
    }
  });

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
