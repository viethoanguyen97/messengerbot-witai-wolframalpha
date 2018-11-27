const FACEBOOK_ACCESS_TOKEN = 'EAAFC0IaV2ywBAMuxIhYPMshG39JiOaKhKDC60YMdWvQRhBin3PC6ZCeKV9aHtQ3LG2K5mpaClOZB860TZAGioaLhzq4gUfnoP5YvEFDM8QudYmul7kKRJbVQkcgPHXm6hnoSRfrbtt9jMrtvnw56Ed5TANZBd0lx8ZBnvzKQKqoAb7OgS575s'
const RestClient = require('node-rest-client').Client
const request = require('request')
const wolfram = require('wolfram').createClient("E8QHYE-X923L74TPG");
const witEntities = require('../constants/WitEntitiesConstants').witEntities;
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
        var location = witData.entities.location[0].value;
        var intent = witData.entities.intent[0].value;

        console.log(witData.entities.location);
        console.log(location, intent);
        if (location) {
            sendTextMessage(senderID, {"text": "Welcome to " + location});
            // switch (intent) {
            //     case witEntities.intents.get_area:
            //         wolfram.query(location + " area", function (err, result) {
            //             console.log(result[1].subpods[0].value)
            //             var result_wolfram = result[1].subpods[0].value;
            //             sendTextMessage(senderID, {"text": result_wolfram});
            //         });
            //         break;
            //     case witEntities.intents.get_unemploy:
            //         wolfram.query(location + " unemploy", function (err, result) {
            //             console.log(result[1].subpods[0].value)
            //             var result_wolfram = result[1].subpods[0].value;
            //             sendTextMessage(senderID, {"text": result_wolfram});
            //         });
            //         break;
            //     case witEntities.intents.get_population:
            //         wolfram.query(location + " population", function (err, result) {
            //             console.log(result[1].subpods[0].value)
            //             var result_wolfram = result[1].subpods[0].value;
            //             sendTextMessage(senderID, {"text": result_wolfram});
            //         });
            //         break;
            //     default:
            //         break;
            // }
             if (intent) {
                 var result_wolfram = wolfram_query.wolfram_query_intent(intent, location, function (result) {
                     console.log(intent, location, result);
                     sendTextMessage(senderID, {"text": result});
                 });
             }

            //     wolfram.query(query, function (err, result) {
            //         console.log(result[1].subpods[0].value)
            //         resultValue = result[1].subpods[0].value;
            //         //return result[1].subpods[0].value;
            //     });
            //
            //     sendTextMessage(senderID, {"text": result_wolfram});
            // }
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