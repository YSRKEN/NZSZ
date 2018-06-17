function doGet() {
  // 参考→https://qiita.com/tfuruya/items/3c306ee03d1ac290bcef
  var json = JSON.stringify(downloadLiveInfoList(2018, 6, 17));
  ContentService.createTextOutput();
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(json);
  return output;
}

function downloadLiveInfoList(year, month, day) {
  // アクセス先
  var url = "https://wikiwiki.jp/nijisanji/?cmd=read&page=配信予定%2F2018-06-17"
  // GETリクエストして結果を取得する
  var response = UrlFetchApp.fetch(url).getContentText();
  // 結果を解析する
  var nodeList = response.match(/<li>\d{2}時\d{2}分.+<\/li>/g);
  var result = [];
  for(var i = 0; i < nodeList.length; ++i){
    var node = nodeList[i];
    if(node.match(/^<li>\d{2}時\d{2}分/) == null){
      continue;
    }
    var pushData = {};
    pushData["youtuber"] = "";
    pushData["date"] = node.match(/^<li>\d{2}時\d{2}分/)[0].replace('<li>','');
    pushData["site"] = "";
    pushData["url"] = "";
    result.push(pushData);
  }
  Logger.log(result);
  return result;
}
