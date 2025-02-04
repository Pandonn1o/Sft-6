import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const archiveFiles = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Create the ./archives directory if it does not exist
    const archivesDir = path.join(process.cwd(), 'archives');
    if (!fs.existsSync(archivesDir)) {
      fs.mkdirSync(archivesDir);
    }

    // Get the current date and time
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');
    const archiveName = `archive_${year}-${month}-${day}_${hour}-${minute}-${second}.zip`;

    // Create the archive file path
    const archivePath = path.join(archivesDir, archiveName);

    // Execute the command to zip and archive files
    const command = `zip -r ${archivePath} ./data`;
    exec(command, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to archive files' });
      }

      return res.status(200).json({ message: 'Files archived successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to archive files' });
  }
};

export default archiveFiles;
