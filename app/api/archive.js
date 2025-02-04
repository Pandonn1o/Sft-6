import { exec } from 'child_process';
import path from 'path';

export async function POST(req) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveName = `archive_${timestamp}.zip`;
        const dataDir = path.resolve(process.cwd(), 'data');
        const archivesDir = path.resolve(process.cwd(), 'archives');
        const archivePath = path.join(archivesDir, archiveName);

        // Ensure the archives directory exists
        exec(`mkdir -p ${archivesDir}`, (mkdirErr) => {
            if (mkdirErr) {
                console.error('Error creating archives directory:', mkdirErr);
                return;
            }
            
            // Execute zip command
            exec(`zip -r ${archivePath} ${dataDir}`, (zipErr, stdout, stderr) => {
                if (zipErr) {
                    console.error('Error creating archive:', stderr);
                    return;
                }
                console.log('Archive created:', archivePath);
            });
        });

        return new Response(JSON.stringify({ message: 'Archiving started', archiveName }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create archive' }), { status: 500 });
    }
}
