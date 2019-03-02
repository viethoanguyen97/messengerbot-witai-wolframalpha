const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('E8QHYE-X923L74TPG');

// waApi.getFull('sin x').then(console.log).catch(console.error);
// // { success: true, error: false, numpods: 13, datatypes: '', ...

waApi.getFull('Vietnam').then(console.log).catch(console.error);
// { success: false, error: false, numpods: 0, datatypes: '', ...
//
// waApi.getFull('sin(x)').then((queryresult) => {
//     const pods = queryresult.pods;
//     const output = pods.map((pod) => {
//         const subpodContent = pod.subpods.map(subpod =>
//             `  <img src="${subpod.img.src}" alt="${subpod.img.alt}">`
//         ).join('\n');
//         return `<h2>${pod.title}</h2>\n${subpodContent}`;
//     }).join('\n');
//     console.log(output);
// }).catch(console.error);

var wolfram_query_random = function (query) {
  console.log(query);

  let result;
  waApi.getFull(query).then((queryresult) => {
    result = queryresult;
    console.log(result);
  }).catch(console.error)

  return result
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

var value = wolfram_query_random("Hanoi population");
console.log(value)