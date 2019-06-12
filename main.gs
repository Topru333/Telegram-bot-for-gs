var token = '';
var url = 'https://api.telegram.org/bot' + token;
var webAppUrl = '';
var ssID = '';
var admin = '';
var ss = SpreadsheetApp.openById(ssID);
var bot_id = 0;
var BOT_USER_NAME = '';

function getMe() {
  var response = UrlFetchApp.fetch(url + '/getMe');
  Logger.log(response.getContentText());
}

function setWebhook() {
  var response = UrlFetchApp.fetch(url + '/setWebhook?url=' + webAppUrl);
  Logger.log(response.getContentText());
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url + '/getUpdates');
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    if (!contents.message || !contents.message.text) {
      return;
    }

    if(!isPrivateMessage(contents) && checkMute(contents)) {
      var msg = {
        chat_id: String(contents.message.chat.id),
        message_id: contents.message.message_id
      }
      deleteMessage(msg);
      return;
    }

    if (contents.message.entities && contents.message.entities[0].type === 'bot_command' && contents.message.entities[0].offset === 0) {
      var command = contents.message.text.slice(1).split(" ")[0];
      var msg = {
        chat_id: String(contents.message.chat.id),
        text: '',
        parse_mode: 'HTML'
      }

      htmlToText(contents);

      var commands = getCommands();

      for (var i in commands) {
        if (commands[i].shortname === command || (commands[i].shortname + BOT_USER_NAME) === command) {
          commands[i](msg, contents);
          break;
        }
      }
      return;

    } else {

      var sheet = ss.getSheetByName('commands');
      var range = sheet.getDataRange();
      var numRows = range.getNumRows();

      for (var i = 1; i <= numRows; i++) {

        var command = range.getCell(i,1).getValue().toLowerCase();

        if(command && contents.message.text.toLowerCase().indexOf(command) != -1) {

          var msg = {
            chat_id: String(contents.message.chat.id),
            text: range.getCell(i,2).getValue()
          }

          sendText(msg);
          return;
        }

      }

    }
  } catch(e) {
    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), JSON.stringify(contents), JSON.stringify(e, null, 4)]);
  }

} 
