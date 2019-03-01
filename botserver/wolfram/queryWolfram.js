const WitEntitiesConstants = require('../constants/WitEntitiesConstants');
const witEntities = WitEntitiesConstants.witEntities;
const wolfram = require('wolfram').createClient(process.env.WOLFRAM_CLIENT_KEY);
require('dotenv').config();
// wolfram.query("vietnam", function(err, result) {
//   console.log("Result: %j", result[0])
// });

const wolfram_query_random = (query, numberOfLocations, callback) => {
  console.log(query);
  wolfram.query(query, function (err, result) {
    if (result && result.length > 0) {
      if (numberOfLocations <= 1) {
        if (result[1].subpods[0].value && result[1].subpods[0].value != '') {
          callback(result[1].subpods[0].value, 'text');
        } else {
          callback(result[1].subpods[0].image, 'image');
        }
      } else {
        if (result[1].subpods[0].image != '') {
          callback(result[1].subpods[0].image, 'image');
        } else {
          callback(result[1].subpods[0].value, 'text');
        }
      }
    } else {
      callback("no data available", 'text');
    }
  });
};

const wolfram_query_text = (query, callback) => {
  console.log(query);

  wolfram.query(query, function (err, result) {
    callback(result[1].subpods[0].value)
  });
};

const wolfram_query_image = (query, callback) => {
  console.log(query);

  wolfram.query(query, function (err, result) {
    callback(result[1].subpods[0].image)
  });
};

const wolfram_query_intent = (wit_intent, location, numberOfLocations,
    callback) => {
  switch (wit_intent) {
    case witEntities.intents.get_area:
      wolfram_query_random(location + " area", numberOfLocations, callback);
      break;
    case witEntities.intents.get_unemploy:
      wolfram_query_random(location + " unemployment rate", numberOfLocations,
          callback);
      break;
    case witEntities.intents.get_population:
      wolfram_query_random(location + " population", numberOfLocations,
          callback);
      break;
    default:
      break;
  }
};

module.exports = {
  wolfram_query_random: wolfram_query_random,
  wolfram_query_image: wolfram_query_image,
  wolfram_query_intent: wolfram_query_intent,
  wolfram_query_text: wolfram_query_text,
  // wolfram_query_all_props: wolfram_query_all_props,
  // wolfram_query_one_prop: wolfram_query_one_prop,
};