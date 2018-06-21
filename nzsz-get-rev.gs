function doGet(e) {
  var retVal = {"revision": "8"};
  var json = JSON.stringify(retVal);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
