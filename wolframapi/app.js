const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('E8QHYE-X923L74TPG');

waApi.getFull('Vietnan').then(console.log).catch(console.error);

// var wolfram = require('wolfram-alpha').createClient("E8QHYE-X923L74TPG", opts);
//
// var results = yield wolfram.query("integrate 2x")
// console.log("Result: %j", rietnamesults);