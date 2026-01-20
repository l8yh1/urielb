module.exports.config = {
  name: "nm",
  version: "1.0.0",
  permission: 1, // admin only
  credits: "yourname",
  prefix: true,
  description: "Lock group name",
  category: "admin",
  usages: "nm [name]",
  cooldowns: 5
};

const lockedNames = new Map();

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  // Check admin
  const threadInfo = await api.getThreadInfo(threadID);
  if (!threadInfo.adminIDs.some(a => a.id == event.senderID)) {
    return api.sendMessage("❌ Admins only.", threadID);
  }

  const newName = args.join(" ");
  if (!newName) {
    return api.sendMessage("⚠️ Usage: nm [group name]", threadID);
  }

  // Set group name
  await api.setTitle(newName, threadID);

  // Save locked name
  lockedNames.set(threadID, newName);

  api.sendMessage(
    `🔒 Group name locked:\n"${newName}"`,
    threadID
  );
};

// Detect name change
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.logMessageType) return;
  if (event.logMessageType !== "log:thread-name") return;

  const threadID = event.threadID;
  if (!lockedNames.has(threadID)) return;

  const lockedName = lockedNames.get(threadID);

  // Ignore if already correct
  if (event.logMessageData.name === lockedName) return;

  // Check who changed it
  const changerID = event.author;
  const threadInfo = await api.getThreadInfo(threadID);

  const isAdmin = threadInfo.adminIDs.some(a => a.id == changerID);
  if (isAdmin) return; // admins allowed

  // Revert name
  await api.setTitle(lockedName, threadID);

  api.sendMessage(
    "🚫 Group name is locked. Changes reverted.",
    threadID
  );
};
