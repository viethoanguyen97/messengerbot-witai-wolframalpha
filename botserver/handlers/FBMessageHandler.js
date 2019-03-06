const RestClient = require('node-rest-client').Client
const request = require('request')
const witEntities = require('../constants/WitEntitiesConstants').witEntities;
const wolfram_query = require('../wolfram/queryWolfram');
const wiki_query = require('../wikipedia/queryWikipedia');
const ChatLogDB = require('../usersLog/usersChatLog');
console.log(process.env.FACEBOOK_ACCESS_TOKEN);

const sendTextMessage = (senderID, text) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: senderID},
      message: text
    }
  })
};

const sendImageMessage = (senderID, image) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: senderID},
      message: image
    }
  })
};

const replyMessageQuery = (senderID, result, resultType) => {
  switch (resultType) {
    case 'image':
      sendImageMessage(senderID,
          {
            "attachment": {
              "type": "image",
              "payload": {
                "url": result,
                "is_reusable": true
              }
            }
          });
      break;
    case 'text':
      sendTextMessage(senderID, {"text": result});
      break;
    default:
      break;
  }
}
const join_multiple_location = (locations) => {
  var result = "";
  for (var it in locations) {
    console.log(locations[it])
    result += locations[it].value + " ";
  }

  result = result.trim()
  console.log(locations, result);

  return result;
};

const send_wolfram_query_result = (senderID, numberOfLocations, query) => {
  var wolfram_query_send = wolfram_query.wolfram_query_random(query,
      numberOfLocations, function (result, resultType) {
        replyMessageQuery(senderID, result, resultType)
      });
};

const handle_query_location_props = (senderID, locations, location_props) => {
  //var location = locations[0].value;
  var location = join_multiple_location(locations);
  var location_property = location_props[0].value;
  var wolfram_query_message = location + " " + location_property;
  console.log("get_place_info", location);
  send_wolfram_query_result(senderID, locations.length, wolfram_query_message);
};

const handle_query_location = (senderID, locations) => {
  var location = locations[0].value;

  result_wiki = wiki_query.get_wiki_summary(location, function (result) {
    console.log("get_brief_summary", location, result);
    sendTextMessage(senderID, {"text": result});
  });
};

module.exports = (event) => {
  const senderID = event.sender.id;
  const fbUserMessage = event.message.text.trim().toLowerCase();

  console.log('SenderID: ' + senderID);
  console.log('User Message: ' + fbUserMessage);
  var senderName = '';
  getSenderInformation((senderInfo) => {
    senderName = senderInfo
  });

  ChatLogDB.logMessage(
      {senderID: senderID, senderName: senderName, message: fbUserMessage});

  getWitAPIData((witData) => {
    console.log(witData);
    if (witData.entities) {
      if (witData.entities.greetings) {
        sendTextMessage(senderID,
            {"text": "Hi, I’m XYZ bot. What can I do for you today?"});
        return;
      }

      if (witData.entities.thanks) {
        sendTextMessage(senderID, {"text": "Glad to help"});
        return;
      }

      if (witData.entities.bye) {
        sendTextMessage(senderID, {"text": "Bye"});
        return;
      }

      if (witData.entities.intent) {
        var intent = witData.entities.intent[0].value;
        console.log(intent);
        switch (intent) {
          case witEntities.intents.get_place_info:
            if (witData.entities.location) {
              if (witData.entities.datetime) {
                var result_wolfram = wolfram_query.wolfram_query_random(
                    fbUserMessage, witData.entities.location.length,
                    function (result, resultType) {
                      console.log(fbUserMessage);
                      console.log(result);
                      replyMessageQuery(senderID, result, resultType)
                    });
                return;
              }
              console.log(witData.entities.location);
              console.log(intent);
              if (witData.entities.location_props) {//location + location props => wolfram
                console.log("query to wolfram")
                handle_query_location_props(senderID, witData.entities.location,
                    witData.entities.location_props);
              } else {//only location => summary
                console.log("query to wiki")
                handle_query_location(senderID, witData.entities.location)
              }
            }
            break;
          case witEntities.intents.get_help_general:
            if (witData.entities.location) {
              if (witData.entities.location_props) { //location + location props => wolfram
                console.log("query to wolfram")
                handle_query_location_props(senderID, witData.entities.location,
                    witData.entities.location_props);
              } else { //location => summary
                console.log("query to wiki")
                handle_query_location(senderID, witData.entities.location)
              }

            } else {
              sendTextMessage(senderID, {"text": "yes, of course"});
            }
            break;
          default:
            if (witData.entities.location) {
              //var location = witData.entities.location[0].value;
              var location = join_multiple_location(witData.entities.location)
              if (witData.entities.datetime) {
                var result_wolfram = wolfram_query.wolfram_query_text(
                    fbUserMessage, function (result) {
                      console.log(fbUserMessage, result);
                      sendTextMessage(senderID, {"text": result});
                    });
              } else {
                var result_wolfram = wolfram_query.wolfram_query_intent(intent,
                    location, witData.entities.location.length,
                    function (result, resultType) {
                      console.log(intent, result);
                      /*sendTextMessage(senderID, {"text": result});*/
                      replyMessageQuery(senderID, result, resultType);
                    });
              }

            } else {
              var result_wolfram = wolfram_query.wolfram_query_text(
                  fbUserMessage, function (result) {
                    console.log(fbUserMessage, result);
                    sendTextMessage(senderID, {"text": result});
                  });
            }
            break;
        }

        return;
      }

      if (witData.entities.wolfram_search_query) { //wolfram_search_query
        //var wolfram_search_query = witData.entities.wolfram_search_query[0].value;
        var result_wolfram = wolfram_query.wolfram_query_random(fbUserMessage,
            0, function (result, resultType) {
              console.log(fbUserMessage);
              console.log(result);
              //sendTextMessage(senderID, {"text": result});
              replyMessageQuery(senderID, result, resultType)
            });

        return;
      }

    } else {
      var result_wolfram = wolfram_query.wolfram_query_random(fbUserMessage,
          function (result, resultType) {
            console.log(fbUserMessage);
            console.log(result);
            //sendTextMessage(senderID, {"text": result});
            replyMessageQuery(senderID, result, resultType)
          });

      return;
    }

  });

  // Ham goi den Wit.ai API
  function getWitAPIData(callback) {
    var client = new RestClient();
    var arguments = {
      data: {userMessage: fbUserMessage},
      headers: {"Content-Type": "application/json"}
    };
    client.post(process.env.WITAPI_URL, arguments,
        function (data, response) {
          if (data.isSuccess == true) {
            callback(data.data)
          } else {
            callback(null)
          }
        })
  }

  function getSenderInformation(callback) {
    request({
      url: "https://graph.facebook.com/v2.6/" + event.sender.id,
      qs: {
        access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        fields: 'first_name'
      },
      method: 'GET'
    }, function (error, response, body) {
      if (!error) {
        var bodyObject = JSON.parse(body)
        callback(bodyObject.first_name)
      }
    })
  }
}