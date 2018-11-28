const WitEntitiesConstants = require('./WitEntitiesConstants');

witEntities = WitEntitiesConstants.witEntities

var wolfram = require('wolfram').createClient("E8QHYE-X923L74TPG")

// wolfram.query("vietnam", function(err, result) {
//   console.log("Result: %j", result[0])
// });

var wolfram_query_random = function (query) {
    console.log(query);

    wolfram.query(query, function (err, result) {
        console.log(result[1].subpods[0].value)
        console.log(result[1].subpods)
        return result[1].subpods[0].value;
    });
}

var wolfram_image_query = (query) => {
    console.log(query)

    wolfram.query(query, function (err, result) {
        console.log(result[1].subpods)
        return result[1].subpods[0].image;
    });
}

var wolfram_query_intent = function (wit_intent, location) {
    switch (wit_intent) {
        case witEntities.intents.get_area:
            return wolfram_query_random(location + " area");
            break;
        case witEntities.intents.get_unemploy:
            return wolfram_query_random(location + " unemploy");
            break;
        case witEntities.intents.get_population:
            return wolfram_query_random(location + " population")
            break;
        default:
            break;
    }
};

var wolfram_query_all_props = function (location) {//get all info of a locations
    wolfram.query(query_message, function (err, result) {
        console.log("Result: %j", result);
        return result
    });
};

var wolfram_query_one_prop = function (prop_name, location) {
    const all_props = wolfram_query_all_props(location);

    all_props.forEach(props => {
        if (props == prop_name) {
            return props.value;
        }
    });

    return null
};

wolfram_query_random("Vietnam map")