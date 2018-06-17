function doGet() {
  // 参考→https://qiita.com/tfuruya/items/3c306ee03d1ac290bcef
  var json = JSON.stringify(downloadLiveInfoList(2018, 6, 17));
  ContentService.createTextOutput();
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(json);
  return output;
}

// leftStringとrightStringに挟まれた部分を切り取る
function crop(inputData, leftString, rightString){
  var index1 = inputData.indexOf(leftString);
  if(index1 == -1){
    return "";
  }
  var index2 = inputData.indexOf(rightString, index1 + leftString.length);
  if(index2 == -1){
    return "";
  }
  return inputData.substring(index1 +  + leftString.length, index2);
}

function downloadLiveInfoList(year, month, day) {
  var date1 = new Date('' + year + '/' + month + '/' + day);
  // アクセス先
  var url = "https://wikiwiki.jp/nijisanji/?cmd=read&page=配信予定%2F" + Utilities.formatDate(date1,'JST','yyyy-MM-dd');
  // GETリクエストして結果を取得する
  var response = UrlFetchApp.fetch(url).getContentText();
  response = response.replace(/<del>.*?<\/del>/g, '');
  // 結果を解析する
  var nodeList = response.match(/<li>.*?時.*?<img.*(<\/li|<br)/g);
  var result = [];
  for(var i = 0; i < nodeList.length; ++i){
    var node = nodeList[i];
    var pushData = {};
    var dateStr = node.match(/^<li>.*?\d{2}時\d{2}分/)[0].replace('<li>','');
    var hour = dateStr.replace(/時.*/, '');
    var minute = crop(dateStr, '時', '分');
    var dateStr2 = '' + year + '/' + month + '/' + day + " " + hour + ":" + minute + ":00";
    var date2 = new Date(dateStr2);
    pushData["youtuber"] = crop(node, '<li>', '<img').replace(/.*>/, '');
    pushData["date"] = Utilities.formatDate(date2,'Asia/Tokyo','yyyy-MM-dd HH-mm-ss');
    pushData["site"] = node.replace(/.*at:/, '').replace(/(<\/li|<br)$/, '').replace(/<.*?>/g, '').replace(/(^\s+)|(\s+$)/g, "").replace(/( |)時間変更/, '');
    pushData["url"] = crop(node, '<a class="ext" href="', '" rel="nofollow"').replace('http://re.wikiwiki.jp/?', '');
    result.push(pushData);
  }
  return result;
}
