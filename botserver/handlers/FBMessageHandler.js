const FACEBOOK_ACCESS_TOKEN = 'EAAFC0IaV2ywBAD9LWuTQ24FDe9E22hg1wqIqPEZCbC4ZBJ2C5tTf3syqmOy7bFVkPPi4PjTcGfoTUDxaZAgM95CSuKrriwE8FvLWIdfoHfDmZARVFUb9rohWUrDI6pFm8LR6nSbJL0yc9V6aseD1d3LZBHlSVdqnuSzgkUCCegrEoBRdM4tCU'
const RestClient = require('node-rest-client').Client
const request = require('request')
const witEntities = require('../constants/WitEntitiesConstants').witEntities;
const getImagesLocationProps = require('../constants/WitEntitiesConstants').getImageLocationProps;
const wolfram_query = require('../wolfram/queryWolfram');

const sendTextMessage = (senderID, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: FACEBOOK_ACCESS_TOKEN},
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
        qs: {access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: senderID},
            message: image
        }
    })
};

module.exports = (event) => {
    const senderID = event.sender.id;
    const fbUserMessage = event.message.text;

    console.log('SenderID: ' + senderID)
    console.log('User Message: ' + fbUserMessage)
    var senderName = '';
    getSenderInformation((senderInfo) => {
        senderName = senderInfo
    });

    getWitAPIData((witData) => {
        console.log(witData);
        if (witData.entities.location){
            var location = witData.entities.location[0].value;
            var intent = witData.entities.intent[0].value;

            console.log(witData.entities.location);
            console.log(location, intent);

            sendTextMessage(senderID, {"text": "Welcome to " + location});
            if (intent) {//co intent
                if (intent == witEntities.intents.get_place_info) {//intent = get_place_info => get location_prop to query
                    var location_property = witData.entities.location_props[0].value;
                    var wolfram_query_message = location + " " + location_property;
                    if (getImagesLocationProps.includes(location_property)){//neu tra ve ket qua la hinh anh
                        console.log("images query");
                        result_wolfram = wolfram_query.wolfram_query_image(wolfram_query_message, function (result) {
                            console.log(intent, location, result);
                            sendImageMessage(senderID,
                                {"attachment": {
                                            "type":"image",
                                            "payload":{
                                                "url": result,
                                                "is_reusable":true
                                            }
                                        }});
                        });
                    } else {//neu tra ve ket qua la text
                        console.log("text query");
                        result_wolfram = wolfram_query.wolfram_query_random(wolfram_query_message, function (result) {
                            console.log(intent, location, result);
                            sendTextMessage(senderID, {"text": result});
                        });
                    }


                } else {
                    var result_wolfram = wolfram_query.wolfram_query_intent(intent, location, function (result) {
                        console.log(intent, location, result);
                        sendTextMessage(senderID, {"text": result});
                    });
                }
            }

        }

         if (witData.entities.wolfram_search_query){ //wolfram_search_query
             var wolfram_search_query = witData.entities.wolfram_search_query[0].value;
             var result_wolfram = wolfram_query.wolfram_query_random(wolfram_search_query, function (result) {
                console.log(wolfram_search_query);
                console.log(result);
                sendTextMessage(senderID, {"text": result});
            });
        }
    });

    // Ham goi den Wit.ai API
    function getWitAPIData(callback) {
        var client = new RestClient();
        var arguments = {
            data: {userMessage: fbUserMessage},
            headers: {"Content-Type": "application/json"}
        };
        client.post("http://localhost:4000/v1/getEntitiesInfo", arguments, function (data, response) {
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
                access_token: FACEBOOK_ACCESS_TOKEN,
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