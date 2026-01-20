module.exports.config = {
  name: "unm",
  version: "1.0.0",
  permission: 1,
  credits: "you",
  prefix: true,
  description: "Unlock group name",
  category: "admin",
  usages: "unm",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const threadID = event.threadID;

  // Admin check
  const info = await api.getThreadInfo(threadID);
  if (!info.adminIDs.some(a => a.id == event.senderID)) {
    return api.sendMessage("❌ Admins only.", threadID);
  }

  // Check if locked
  if (!global.lockedNames || !global.lockedNames.has(threadID)) {
    return api.sendMessage("ℹ️ Group name is not locked.", threadID);
  }

  // Unlock
  global.lockedNames.delete(threadID);

  api.sendMessage("🔓 Group name unlocked.", threadID);
};
