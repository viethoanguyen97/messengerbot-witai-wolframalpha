const WitEntitiesConstants = require('../constants/WitEntitiesConstants');
const witEntities = WitEntitiesConstants.witEntities;
const wolfram = require('wolfram').createClient("E8QHYE-X923L74TPG");

// wolfram.query("vietnam", function(err, result) {
//   console.log("Result: %j", result[0])
// });

const wolfram_query_random = (query, callback) =>{
    console.log(query);

    wolfram.query(query, function (err, result) {
        callback(result[1].subpods[0].value)
    });
};

const wolfram_query_image = (query, callback) =>{
    console.log(query);

    wolfram.query(query, function (err, result) {
        callback(result[1].subpods[0].image)
    });
};

const wolfram_query_intent = (wit_intent, location, callback) => {
    switch (wit_intent) {
        case witEntities.intents.get_area:
            wolfram_query_random(location + " area", callback);
            break;
        case witEntities.intents.get_unemploy:
            wolfram_query_random(location + " unemploy", callback);
            break;
        case witEntities.intents.get_population:
            wolfram_query_random(location + " population", callback);
            break;
        case witEntities.intents.get_place_info:
        default:
            break;
    }
};

// const wolfram_query_all_props = (location) => {//get all info of a locations
//     wolfram.query(query_message, function (err, result) {
//         console.log("Result: %j", result);
//         return result
//     });
// };
//
// const wolfram_query_one_prop = (prop_name, location) => {
//     const all_props = wolfram_query_all_props(location);
//
//     all_props.forEach(props => {
//         if (props == prop_name) {
//             return props.value;
//         }
//     });
//
//     return null
// };
//
// var value = wolfram_query_random("Hanoi population");
// console.log(value)

module.exports = {
    wolfram_query_random: wolfram_query_random,
    wolfram_query_image: wolfram_query_image,
    wolfram_query_intent: wolfram_query_intent,
    // wolfram_query_all_props: wolfram_query_all_props,
    // wolfram_query_one_prop: wolfram_query_one_prop,
};