const { spawn } = require('child_process');
const path = require('path');

/**
 * Enhanced Reboot Script for Messenger Bot
 * - Prevents crash loops with delayed restarts
 * - Maximizes uptime by handling exits gracefully
 */

function start() {
    console.log('Starting Messenger Bot...');
    const child = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    child.on('close', (code) => {
        // code 0: normal exit, code null/other: crash
        const delay = (code === 0 || code === null) ? 2000 : 5000;
        console.log(`Bot process exited with code ${code}. Restarting in ${delay/1000}s...`);
        setTimeout(start, delay);
    });

    child.on('error', (err) => {
        console.error('Failed to start bot:', err);
        setTimeout(start, 10000); 
    });

    // Cleanup child process on script exit
    process.on('SIGINT', () => { child.kill(); process.exit(); });
    process.on('SIGTERM', () => { child.kill(); process.exit(); });
}

start();
