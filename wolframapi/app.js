// const WolframAlphaAPI = require('wolfram-alpha-api');
// const waApi = WolframAlphaAPI('E8QHYE-X923L74TPG');
//
// waApi.getFull('Vietnan').then(console.log).catch(console.error);
import {WitEntities} from "../botserver/handlers/WitEntitiesConstants";

var wolfram = require('wolfram').createClient("E8QHYE-X923L74TPG")

wolfram.query("vietnam", function(err, result) {
  console.log("Result: %j", result[0])
});

var wolfram_query_intent = function(location) {
  switch (wit_intent) {
    case WitEntities.intents.get_area:
      wolfram.query(location + " area", function (err, result) {
        console.log("Result: %j", result);
        return result.value;
      });
      break;
    case WitEntities.intents.get_unemploy:
      wolfram.query(location + " unemploy", function (err, result) {
        console.log("Result: %j", result);
        return result.value;
      });
      break;
    case WitEntities.intents.get_population:
      wolfram.query(location + " population", function (err, result) {
        console.log("Result: %j", result);
        return result.value;
      });
      break;
    // case WitEntities.intents.get_place_info:
    //   console.log("Result: %j", result);
    //   //wolfram.query(location + " area");
    //   break;
    // case WitEntities.intents.get_area:
    //   wolfram.query(location + " area");
    //   break;
    default:
      break;
  }
};

var wolfram_query_all_props = function(location){//get all info of a locations
  wolfram.query(query_message, function(err, result){
    console.log("Result: %j", result);
    return result
  });
};

var wolfram_query_one_prop = function(prop_name, location){
  const all_props = wolfram_query_all_props(location);

  all_props.forEach(props => {
    if (props == prop_name){
      return props.value;
    }
  });

  return null
};