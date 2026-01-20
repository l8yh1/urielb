// ----------------------
// GLOBAL DEDUPLICATION SETUP
// ----------------------
global.seenMessages = global.seenMessages || new Set(); // Track already handled messages
global.lastReply = global.lastReply || {}; // Optional rate limit per thread

/**
 * Returns true if this message was already handled.
 * Prevents double replies and spam bans.
 */
function alreadyHandled(messageID) {
  if (global.seenMessages.has(messageID)) return true;
  global.seenMessages.add(messageID);

  // Auto-remove after 60 seconds
  setTimeout(() => {
    global.seenMessages.delete(messageID);
  }, 60 * 1000);

  return false;
}

/**
 * Rate limit per thread (optional, safe)
 * Ensures max 1 reply per 1.5 seconds per thread
 */
function rateLimit(threadID) {
  const now = Date.now();
  if (global.lastReply[threadID] && now - global.lastReply[threadID] < 1500) {
    return true;
  }
  global.lastReply[threadID] = now;
  return false;
}

// ----------------------
// YOUR MAIN BOT HANDLER
// ----------------------
module.exports.run = async function ({ api, event, args }) {
  // 1️⃣ Prevent duplicate messages
  if (alreadyHandled(event.messageID)) return;

  // 2️⃣ Optional per-thread rate limit
  if (rateLimit(event.threadID)) return;

  // ----------------------
  // 3️⃣ Your bot logic starts here
  // ----------------------

  const message = event.body || "";

  // Example AI command
  if (message.toLowerCase().startsWith("ai")) {
    // Replace this with your AI response logic
    const replyText = "🤖 AI says: hello!";
    return api.sendMessage(replyText, event.threadID);
  }

  // Example banned check (single response only)
  if (message.toLowerCase() === "ban") {
    return api.sendMessage("⚠️ You are banned temporarily.", event.threadID);
  }

  // Example admin command: lock/unlock group name
  if (message.toLowerCase().startsWith("!nm ")) {
    // Your nm lock command logic goes here
    return api.sendMessage("🔒 Name locked (dummy example)", event.threadID);
  }

  if (message.toLowerCase() === "!unm") {
    // Your unm unlock command logic goes here
    return api.sendMessage("🔓 Name unlocked (dummy example)", event.threadID);
  }

  // ----------------------
  // END OF BOT LOGIC
  // ----------------------
};
