var GOOGLE_SEARCH_API_KEY = '';
var GOOGLE_SEARCH_CX = '';
var GIPHY_API_KEY = '';



var sheets = function (msg, contents) {
  msg.text = 'https://docs.google.com/spreadsheets/d/1HgpzWnRJqi1YQZ1YxvPbUoJCnAFYCoD73l38eeBofdM/edit?usp=sharing';
  sendText(msg);
}

var alive = function (msg, contents) {
  msg.text = 'Я жива, все ок.';
  sendText(msg);
}

var check = function (msg, contents) {
  var procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 6) {
    text = contents.message.text.slice(19).trim();
  } else {
    text = contents.message.text.slice(6).trim();
  }

  if (text.length < 1) {
    msg.text = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    return;
  }

  if (contents.message.entities.length > 1 && (contents.message.entities[1].type === 'text_mention' || contents.message.entities[1].type === 'mention')) {
    if (contents.message.entities[1].type === 'text_mention') {
      text = text.replace(contents.message.entities[1].user.first_name, ('<a href="tg://user?id=' + contents.message.entities[1].user.id + '">' + contents.message.entities[1].user.first_name + '</a>'));
    }
    msg.text = text + ' на ' + procent;
  }
  else {
    msg.text = '<a href="tg://user?id=' + contents.message.from.id + '">' + contents.message.from.first_name + '</a> ' + text + ' на <b>' + procent + '</b>';
  }
  sendText(msg);
}

var answerme = function (msg, contents) {
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 9) {
    text = contents.message.text.slice(22).trim().toLowerCase();
  } else {
    text = contents.message.text.slice(9).trim().toLowerCase();
  }

  if (text.length < 1) {
    msg.text = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    return;
  }


  var db = getDataBase();
  var answers = db.getData('answers');

  if (text === 'answers') {
    for (var i in answers) {
      if (answers[i]) {
        msg.text = msg.text + ' %0A' + answers[i].question + ' : <b> ' + answers[i].answer + '</b> ';
      }
    }
    msg.text = decodeURI(msg.text);
    return;
  }

  var emptyIndex;
  for (var i in answers) {
    if (!answers[i]) {
      emptyIndex = i;
    }
    else if (answers[i].question === text) {
      msg.text = text + ' Ответ я уже давала: <b> ' + answers[i].answer + '</b>';
      if (Math.random() <= 0.32) {
        answers[i].answer = (answers[i].answer === 'да' ? 'нет' : 'да');
        msg.text = text + ' Окей, мой ответ: <b> ' + answers[i].answer  + '</b>';
        db.updateData('answers/' + i, answers[i]);
      }
      sendText(msg);
      return;
    }
  }

  var answer = Math.random() > 0.5 ? 'да' : 'нет';
  if (emptyIndex) {
    answers[emptyIndex] = {
      'question' : text,
      'answer' : answer,
      'date' : new Date()
    };
  } else {
    answers.push({
      'question' : text,
      'answer' : answer,
      'date' : new Date()
    });
  }


  db.setData('answers', answers);

  if (contents.message.entities.length > 1 && (contents.message.entities[1].type === 'text_mention' || contents.message.entities[1].type === 'mention')) {
    if (contents.message.entities[1].type === 'text_mention') {
      text = text.replace(contents.message.entities[1].user.first_name, ('<a href="tg://user?id=' + contents.message.entities[1].user.id + '">' + contents.message.entities[1].user.first_name + '</a>'));
    }
  }

  msg.text = text + ' Ответ: <b> ' + answer + '</b>';
  sendText(msg);
}

var test = function (msg, contents) {
  var sheet = ss.getSheetByName('TestMessages');
  sheet.appendRow([new Date(), JSON.stringify(contents, null, 4)]);
  msg.text = JSON.stringify(contents, null, 4);
  sendText(msg);
}

var search = function(msg, contents) {
  var api_key = GOOGLE_SEARCH_API_KEY;
  var cx = GOOGLE_SEARCH_CX;
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 7) {
    text = contents.message.text.slice(20).trim();
  } else {
    text = contents.message.text.slice(7).trim();
  }
  var url = ('https://www.googleapis.com/customsearch/v1?key=%key%&cx=%cx%&q=').replace("%key%", encodeURIComponent(api_key)).replace("%cx%", encodeURIComponent(cx)) + text.split(' ').join('+');
  var params = {
    muteHttpExceptions: true,
    "User-Agent" : "Mozilla/5.0",
    "Accept-Language" : "en-GB,en;q=0.5",
  };

  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();

  if (respCode !== 200) {
    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), response.getResponseCode(), "Error " +respCode + " " + response.getContentText(), url]);
    msg.text = 'Was problem with search api. Can be problem with quotas. Please check errors.'
    return;
  }

  var result = JSON.parse(response.getContentText());

  var link = result.items[0].link;
  var name = result.items[0].title;
  msg.text = '<b>' + name + '</b>   <a href="' + link + '">Ссылка</a>';
  sendText(msg);
}

var pic = function(msg, contents) {
  var api_key = GOOGLE_SEARCH_API_KEY;
  var cx = GOOGLE_SEARCH_CX;
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 4) {
    text = contents.message.text.slice(17).trim();
  } else {
    text = contents.message.text.slice(4).trim();
  }

  if (!text) {
    msg.text = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    sendText(msg);
    return;
  }

  var url = ('https://www.googleapis.com/customsearch/v1?key=%key%&cx=%cx%&searchType=image&q=').replace("%key%", encodeURIComponent(api_key)).replace("%cx%", encodeURIComponent(cx)) + text.split(' ').join('+');
  var params = {
    muteHttpExceptions: true,
    "User-Agent" : "Mozilla/5.0",
    "Accept-Language" : "en-GB,en;q=0.5",
  };

  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();

  if (respCode !== 200) {
    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), response.getResponseCode(), "Error " +respCode + " " + response.getContentText(), url]);
    msg.text = 'Was problem with search api. Can be problem with quotas. Please check errors.'
    sendText(msg);
    return;
  }

  var result = JSON.parse(response.getContentText());

  if (!result.items || result.items.length == 0) {
    msg.text = '0 results for <b>' + text + '</b>';
    sendText(msg);
    return;
  }

  var max = result.items.length > 20 ? 20 : result.items.length;
  var index = Math.floor(Math.random() * max);

  msg.reply_to_message_id = contents.message.message_id;
  msg.photo = result.items[index].link;
  sendPhoto(msg);
}

var giphy = function(msg, contents) {
  var api_key = GIPHY_API_KEY;
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 6) {
    text = contents.message.text.slice(19).trim();
  } else {
    text = contents.message.text.slice(6).trim();
  }

  var params = {
    muteHttpExceptions: true,
    'method' : 'get',
    "User-Agent" : "Mozilla/5.0",
    "Accept-Language" : "en-GB,en;q=0.5",
  };

  var url = 'http://api.giphy.com/v1/gifs/search?q=' + text.split(' ').join('+') + '&api_key=' + api_key;

  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();

  if (respCode !== 200) {
    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), response.getResponseCode(), "Error " +respCode + " " + response.getContentText(), url]);
    msg.text = 'Was problem with giphy api. Please check errors.'
    sendText(msg);
    return;
  }

  var result = JSON.parse(response.getContentText());


  if (!result.data || result.data.length == 0) {
    msg.text = '0 results for <b>' + text + '</b>';
    sendText(msg);
    return;
  }
  var max = result.data.length;

  var index = Math.floor(Math.random() * max);
  var link = result.data[index].images.original.url;
  msg.animation = link;
  msg.reply_to_message_id = contents.message.message_id;
  sendAnimation(msg);
}

var gfycat = function(msg, contents) {

  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 7) {
    text = contents.message.text.slice(20).trim();
  } else {
    text = contents.message.text.slice(7).trim();
  }

  var params = {
    muteHttpExceptions: true,
    'method' : 'get',
    "User-Agent" : "Mozilla/5.0",
    "Accept-Language" : "en-GB,en;q=0.5",
  };

  var url = 'https://api.gfycat.com/v1/gfycats/search?search_text=' + text.split(' ').join('+');

  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();

  if (respCode !== 200) {
    var sheet = ss.getSheetByName('Errors');
    sheet.appendRow([new Date(), response.getResponseCode(), "Error " +respCode + " " + response.getContentText(), url]);
    msg.text = 'Was problem with giphy api. Please check errors.'
    sendText(msg);
    return;
  }

  var result = JSON.parse(response.getContentText());

  if (!result.gfycats || result.gfycats.length == 0) {
    msg.text = '0 results for <b>' + text + '</b>';
    sendText(msg);
    return;
  }

  var max = result.gfycats.length;

  var index = Math.floor(Math.random() * max);
  var link = result.gfycats[index].gifUrl;
  msg.animation = link;
  msg.reply_to_message_id = contents.message.message_id;
  sendAnimation(msg);
}

var mute = function (msg, contents) {
  if (!contents.message.reply_to_message) {
    msg.text = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    sendText(msg);
    return;
  }

  if (contents.message.reply_to_message.from.id === bot_id) {
    msg.reply_to_message_id = contents.message.reply_to_message.message_id;
    msg.text = '(Очко себе замуть, пёс> (╯°□°）╯︵ ┻━┻'
    sendText(msg);
    return;
  }
  if (isPrivateMessage(contents)) {
    var msg = {
      chat_id: String(contents.message.chat.id),
      text: 'Нелья юзать в личке!'
    }
    sendText(msg);
    return;
  }
  var scriptProperties = PropertiesService.getScriptProperties();
  var mutes = scriptProperties.getProperty('MUTE');
  if (mutes.indexOf(contents.message.reply_to_message.from.id) === -1) {
    mutes = mutes + '/' + contents.message.reply_to_message.from.id;
    scriptProperties.setProperty('MUTE', mutes);
    msg.reply_to_message_id = contents.message.reply_to_message.message_id;
    msg.text = 'Захлопнись.'
  } else {
    msg.text = 'Он уже молчит.'
  }

  sendText(msg);
}

var unmute = function (msg, contents) {

  if (!contents.message.reply_to_message) {
    msg.text = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    sendText(msg);
    return;
  }

  if (contents.message.reply_to_message.from.id === bot_id) {
    msg.reply_to_message_id = contents.message.reply_to_message.message_id;
    msg.text = '(Очко себе замуть, пёс> (╯°□°）╯︵ ┻━┻'
    sendText(msg);
    return;
  }
  if (isPrivateMessage(contents)) {
    var msg = {
      chat_id: String(contents.message.chat.id),
      text: 'Нелья юзать в личке!'
    }
    sendText(msg);
    return;
  }
  var scriptProperties = PropertiesService.getScriptProperties();
  var mutes = scriptProperties.getProperty('MUTE');
  if (mutes.indexOf(contents.message.reply_to_message.from.id) != -1) {
    mutes = mutes.replace('/' + contents.message.reply_to_message.from.id, '');
    scriptProperties.setProperty('MUTE', mutes);
    msg.text = 'Можешь говорить.'
  } else {
    msg.text = 'Я его не затыкала еще.'
  }
  msg.reply_to_message_id = contents.message.reply_to_message.message_id;
  sendText(msg);
}

var everyone = function (msg, contents) {
  var users = getChatAdministrators(msg).result;
  var text;
  if (contents.message.text.indexOf(BOT_USER_NAME) === 9) {
    text = contents.message.text.slice(22).trim();
  } else {
    text = contents.message.text.slice(9).trim();
  }
  for (var i in users) {
    if (!users[i].user.is_bot) {
      msg.text = msg.text + ' ' + '<a href="tg://user?id=' + users[i].user.id + '">' + users[i].user.first_name + '</a> '
    }
  }
  msg.reply_to_message_id = contents.message.message_id;
  sendText(msg);
}

everyone.shortname = 'everyone';
mute.shortname = 'mute';
unmute.shortname = 'unmute';
gfycat.shortname = 'gfycat';
giphy.shortname = 'giphy';
sheets.shortname = 'sheets';
check.shortname = 'check';
answerme.shortname = 'answerme';
test.shortname = 'test';
search.shortname = 'search';
pic.shortname = 'pic';
alive.shortname = 'alive';

function getCommands() {
  var result = [check, answerme, everyone, search, pic, giphy, gfycat, sheets, test, alive, mute, unmute];
  return result;
}
