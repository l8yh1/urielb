const { spawn } = require('child_process');
const path = require('path');

function start() {
    console.log('Starting Messenger Bot...');
    const child = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    child.on('close', (code) => {
        console.log(`Bot process exited with code ${code}. Restarting...`);
        start();
    });

    child.on('error', (err) => {
        console.error('Failed to start bot:', err);
        setTimeout(start, 5000); // Wait 5 seconds before retrying on error
    });
}

start();
