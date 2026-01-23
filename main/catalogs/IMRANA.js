console.clear();
const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const logger = require("./IMRANC.js");
const path = require('path'); 
const PORT = process.env.PORT || 5000;
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/website/ryuko.html'));
});
console.clear();
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function startBot(message) {
    (message) ? logger(message, "starting") : "";
  console.log(chalk.blue('DEPLOYING MAIN SYSTEM'));
  logger.loader(`deploying app on port ${chalk.blueBright(PORT)}`);
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.loader(`app deployed on port ${chalk.blueBright(PORT)}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(chalk.yellow(`Port ${PORT} is busy, waiting 3 seconds...`));
      setTimeout(() => {
        server.close();
        app.listen(PORT, '0.0.0.0');
      }, 3000);
    } else {
      console.error('Server error:', err);
    }
  });
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "IMRANB.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot();
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
    logger("an error occurred : " + JSON.stringify(error), "error");
  });
};
startBot();
