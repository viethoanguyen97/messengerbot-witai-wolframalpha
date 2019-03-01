const RestClient = require('node-rest-client').Client;
const EXTRACT_SUMMARY_QUERY = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${title}"

// Ham goi den Wit.ai API
function getWikiSummary(title, callback) {
  var client = new RestClient();
  var arguments = {
    path: {"title": title},
    headers: {"Content-Type": "application/json"}
  };

  client.get(EXTRACT_SUMMARY_QUERY, arguments, function (data, response) {
    // console.log(data.query)
    var pages = data.query.pages
    var summary = "";
    for (var key in pages) {
      var extract = pages[key].extract
      summary = extract.substr(0, extract.indexOf("\n"));
      break;
    }
    console.log(summary)
    callback(summary)
  });
}

//getWikiSummary("Viet Nam");
module.exports = {
  get_wiki_summary: getWikiSummary,
};