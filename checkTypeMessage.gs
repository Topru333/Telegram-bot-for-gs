function isPrivateMessage(contents) {
  if (contents.message.chat.type === "private") {
    return true;
  }
  return false;
}

function isGroupMessage(contents) {
  if (contents.message.chat.type === "group") {
    return true;
  }
  return false;
}

function isSuperGroupMessage(contents) {
  if (contents.message.chat.type === "supergroup") {
    return true;
  }
  return false;
}

function isChannelMessage(contents) {
  if (contents.message.chat.type === "channel") {
    return true;
  }
  return false;
}
