function htmlToText(contents) {
  if (contents.message.text.indexOf('/') !== -1) {
    contents.message.text = contents.message.text.split('/').join('∕');
  }

  if (contents.message.text.indexOf('&') !== -1) {
    contents.message.text = contents.message.text.split('&').join('&amp;');
  }

  if (contents.message.text.indexOf('<') !== -1) {
    contents.message.text = contents.message.text.split('<').join('&lt;');
  }

  if (contents.message.text.indexOf('>') !== -1) {
    contents.message.text = contents.message.text.split('>').join('&gt;');
  }

  if (contents.message.text.indexOf('"') !== -1) {
    contents.message.text = contents.message.text.split('"').join('&quot;');
  }
}

function getElementsByClassName(element, classToFind) {
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if(elt != null) {
      var classes = elt.getAttribute('class');
      if(classes != null) {
        classes = classes.getValue();
        if(classes === classToFind) {
          data.push(elt);
        }
      }
    }
  }
  return data;
}

function writeToTestTable(value, bonus) {
  if (!bonus)
    bonus = '';
  var ss = SpreadsheetApp.openById(ssID);
  var sheet = ss.getSheetByName('TestMessages');
  sheet.appendRow([new Date(), value, bonus]);
}

function removeElementFromArray(array, index) {

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function checkMute(contents) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var mutes = scriptProperties.getProperty('MUTE');
  if (mutes.indexOf(contents.message.from.id) != -1) {
    return true;
  }
  return false;
}
