const LIB_PREFIX = "joinCheck_";

function _isJoined(chats, onAllJoined, onNotJoined) {
  var chatsArray = chats.split(",");
  User.setProperty("totalChats", chatsArray.length, "integer");
  User.setProperty("joinedChats", 0, "integer");
  User.setProperty("notJoinedChats", JSON.stringify([]), "string"); // Initialize as empty array

  // Store callback commands for later use
  User.setProperty("onAllJoined", onAllJoined, "string");
  User.setProperty("onNotJoined", onNotJoined, "string");

  for(var i = 0; i < chatsArray.length; i++) {
    _checkMembership(chatsArray[i].trim());
  }
}

function _checkMembership(chat_id) {
  Api.getChatMember({
    chat_id: chat_id,
    user_id: user.telegramid,
    on_result: LIB_PREFIX + "_onCheckMembership",
    bb_options: { chat_id: chat_id }
  });
}

// Assume this function logic is placed within the Bots.Business command named according to LIB_PREFIX + "onCheckMembership"
function _onCheckMembership() {
  var result = options.result;
  var chat_id = result.bb_options.chat_id;
  var totalChats = User.getProperty("totalChats");
  var joinedChats = User.getProperty("joinedChats");
  var notJoinedChats = JSON.parse(User.getProperty("notJoinedChats"));

  if(result.status === 'member' || result.status === 'administrator' || result.status === 'creator') {
    joinedChats++;
    User.setProperty("joinedChats", joinedChats, "integer");
  } else {
    notJoinedChats.push(chat_id);
    User.setProperty("notJoinedChats", JSON.stringify(notJoinedChats), "string");
  }

  // Check if this was the last chat to verify
  if(joinedChats + notJoinedChats.length == totalChats) {
    if(joinedChats == totalChats) {
      // User has joined all chats, execute onAllJoined command
      Bot.runCommand(User.getProperty("onAllJoined"));
    } else {
      // User hasn't joined all the specified chats, execute onNotJoined with notJoinedChats as params
      var notJoinedChatsStr = notJoinedChats.join(", ");
      Bot.run({
        command: User.getProperty("onNotJoined"),
        options: { not_joined_chats: notJoinedChatsStr }
      });
    }
  }
}
