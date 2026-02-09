import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://byte-wipe-vohl.vercel.app" }));

// directory to save generated wipe certificates
const CERT_DIR = path.join(process.cwd(), "certificates");
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR);
}

// helper function to run system commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(stderr || stdout);
      else resolve(stdout || stderr);
    });
  });
}

// --- API Endpoints ---

// 1. Get devices (simulate for frontend)
app.get("/devices", async (req, res) => {
  try {
    // In production, replace with `lsblk` parsing
    const devices = [
      { name: "sda", size: "500GB", type: "HDD" },
      { name: "nvme0n1", size: "1TB", type: "SSD" }
    ];
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Failed to list devices" });
  }
});

// 2. Start wipe (simulate commands)
app.post("/wipe", async (req, res) => {
  const { device, type } = req.body; // type = HDD/SSD
  try {
    // Instead of real wipe, just simulate log
    let log = `Simulated wipe started for ${device} (${type})\n`;

    if (type === "SSD") {
      log += "Running ATA Secure Erase (simulated)...\n";
      // await runCommand(`hdparm ...`);   <-- real command
    } else {
      log += "Overwriting with random data (simulated)...\n";
      // await runCommand(`dd if=/dev/urandom of=${device} ...`);
    }

    log += "Wipe completed successfully.\n";

    // Save certificate as PDF
    const certPath = path.join(CERT_DIR, `${device}_certificate.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(certPath));
    doc.fontSize(16).text("Secure Wipe Certificate", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Device: ${device}`);
    doc.text(`Type: ${type}`);
    doc.text(`Status: SUCCESS`);
    doc.text(`Date: ${new Date().toISOString()}`);
    doc.end();

    res.json({
      message: "Wipe completed successfully",
      log,
      certificate: `/certificate/${path.basename(certPath)}`
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// 3. Download certificate
app.get("/certificate/:file", (req, res) => {
  const filePath = path.join(CERT_DIR, req.params.file);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ error: "Certificate not found" });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SecureWipe backend running on port ${PORT}`);
});