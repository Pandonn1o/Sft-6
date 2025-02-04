import { NextResponse } from 'next/server';
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const output = fs.createWriteStream(path.join(process.cwd(), 'archives', `archive_${new Date().toISOString().replace(/:/g, '-')}.zip`));
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      res.status(200).json({ message: 'Archiving completed successfully!' });
    });

    archive.on('error', (err) => {
      res.status(500).json({ message: 'Archiving failed!', error: err.message });
    });

    archive.pipe(output);

    const dataDir = path.join(process.cwd(), 'data');
    fs.readdir(dataDir, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to read data directory!', error: err.message });
      }

      files.forEach((file) => {
        archive.file(path.join(dataDir, file), { name: file });
      });

      archive.finalize();
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
