
const startTime = Date.now();
const interval = 15000; // 15 seconds
const oneHour = 3600000; // 1 hour in milliseconds

console.log("Engine is active");

const timer = setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - startTime >= oneHour) {
        console.log("Engine Auto-off");
        clearInterval(timer);
        process.exit(0);
    } else {
        console.log("Hi, how are you doing");
    }
}, interval);
