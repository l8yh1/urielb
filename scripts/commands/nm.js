const lockedNames = new Map();

module.exports.config = {
  name: "nm",
  version: "1.1.0",
  permission: 1,
  credits: "you",
  prefix: true,
  description: "Lock group name",
  category: "admin",
  usages: "nm [name]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  const threadInfo = await api.getThreadInfo(threadID);
  if (!threadInfo.adminIDs.some(a => a.id == event.senderID)) {
    return api.sendMessage("❌ Admins only.", threadID);
  }

  const name = args.join(" ");
  if (!name) {
    return api.sendMessage("⚠️ Usage: nm [group name]", threadID);
  }

  await api.setTitle(name, threadID);
  lockedNames.set(threadID, name);

  api.sendMessage(`🔒 Group name locked:\n${name}`, threadID);
};

/**
 * Poll every 5 seconds
 */
setInterval(async () => {
  for (const [threadID, lockedName] of lockedNames) {
    try {
      const info = await global.client.api.getThreadInfo(threadID);
      if (info.threadName !== lockedName) {
        await global.client.api.setTitle(lockedName, threadID);
      }
    } catch (e) {}
  }
}, 5000);
