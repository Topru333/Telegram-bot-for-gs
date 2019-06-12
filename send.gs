function sendText(payload) {
  send(payload, '/sendMessage');
}

function sendPhoto(payload) {
  send(payload, '/sendPhoto');
}

function sendAnimation(payload) {
  send(payload, '/sendAnimation');
}

function restrictMember(payload) {
  send(payload, '/restrictChatMember');
}

function deleteMessage(payload) {
  send(payload, '/deleteMessage');
}

function getChatAdministrators(payload) {
  return send(payload, '/getChatAdministrators');
}

function send(payload, method) {
  var params = {
    method: 'POST',
    //muteHttpExceptions:true,
    escaping: true,
    payload: payload
  }

  try {

    var sendMessageResponce = UrlFetchApp.fetch(url + method, params);

    return JSON.parse(sendMessageResponce.getContentText());

  } catch (e) {

    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), JSON.stringify(e, null, 4)]);
    return e.message;
  };
}
