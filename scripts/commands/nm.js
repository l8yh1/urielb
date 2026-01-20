const lockedNames = new Map();

module.exports.config = {
  name: "nm",
  version: "1.0.0",
  permission: 1,
  credits: "you",
  prefix: true,
  description: "Lock group name",
  category: "admin",
  usages: "nm [name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
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

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:thread-name") return;

  const threadID = event.threadID;
  if (!lockedNames.has(threadID)) return;

  const lockedName = lockedNames.get(threadID);

  if (event.logMessageData?.name === lockedName) return;

  const threadInfo = await api.getThreadInfo(threadID);
  const changerID = event.author;

  if (threadInfo.adminIDs.some(a => a.id == changerID)) return;

  await api.setTitle(lockedName, threadID);
  api.sendMessage("🚫 Group name is locked.", threadID);
};
