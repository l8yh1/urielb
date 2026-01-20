const lockedNames = new Map();

module.exports.config = {
  name: "nm",
  version: "1.2.0",
  permission: 1,
  credits: "you",
  prefix: true,
  description: "Lock group name",
  category: "admin",
  usages: "nm [name]",
  cooldowns: 5
};

module.exports.onLoad = function () {
  setInterval(async () => {
    if (!global.client?.api) return;

    for (const [threadID, lockedName] of lockedNames.entries()) {
      try {
        const info = await global.client.api.getThreadInfo(threadID);
        if (info.threadName !== lockedName) {
          await global.client.api.setTitle(lockedName, threadID);
        }
      } catch (e) {}
    }
  }, 5000);
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;

  const info = await api.getThreadInfo(threadID);
  if (!info.adminIDs.some(a => a.id == event.senderID)) {
    return api.sendMessage("❌ Admins only.", threadID);
  }

  const name = args.join(" ");
  if (!name) {
    return api.sendMessage("⚠️ Usage: nm [name]", threadID);
  }

  await api.setTitle(name, threadID);
  lockedNames.set(threadID, name);

  api.sendMessage(`🔒 Group name locked:\n${name}`, threadID);
};
