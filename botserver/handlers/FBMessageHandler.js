const FACEBOOK_ACCESS_TOKEN = 'EAACuVUCZCsXsBAMmnOxkqTSnewxQlnh8BU3sUJuukibHZAFF4dqg3Afem0YYO5TZBx7C2X2BLRfQoTdIPJzFTvxQ8QXmlwKAy3ZAygs67HQid6UpDFUPy0xyqE9454xTpqk492B8lYxNtlQUv3keWctVgZBQ8OsnCEPPXnKG8YVGgL7bnTPhs'
const RestClient = require('node-rest-client').Client
const request = require('request')

const sendTextMessage = (senderID, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: { id: senderID},
            message: text
        }
    })
}

module.exports = (event) => {
    const senderID = event.sender.id
    const fbUserMessage = event.message.text

    console.log('SenderID: ' + senderID)
    console.log('User Message: ' + userMessage)
    // var senderName = ''
    // getSenderInformation((senderInfo) => {
    //     senderName = senderInfo
    // })

    // getWitAPIData((witData) => {
    //     if (witData.entities.location){
    //         sendTextMessage(senderID, { "text" : "Welcome to " + witData.entities.location.value })
    //     }
    //     // if (witData.entities.greet) {
    //     //     sendTextMessage(senderID, { "text" : "Chào " + senderName + ", tôi có thể giúp gì được cho bạn?"})
    //     // }

    //     // if (witData.entities.song && witData.entities.hit) {
    //     //     switch (witData.entities.website[0].value) {
    //     //         case "Zing.vn":
    //     //         case "zing":
    //     //         case "MP3.Zing":
    //     //             sendTextMessage(senderID, { "text" : "Bài hát hay nhất trên Zing.vn là Cô gái M52"})
    //     //             break;
    //     //         case "nhaccuatui":
    //     //         case "nhạc của tui":
    //     //         case "nhaccuatui.com": 
    //     //         case "NCT": 
    //     //             sendTextMessage(senderID, { "text" : "Tuyệt vời, bài hát nghe nhiều nhất trên nhạc của tui là bài Người âm phủ!"})
    //     //             break;
    //     //         default:
    //     //             break;
    //     //     }
    //     // }
    // })
    // // Ham goi den Wit.ai API 
    // function getWitAPIData(callback) {
    //     var client = new RestClient()
    //     var arguments = {
    //         data: { userMessage: fbUserMessage },
    //         headers: { "Content-Type": "application/json" }
    //     };
    //     client.post("http://localhost:4000/v1/getEntitiesInfo", arguments, function(data, response) {
    //         if (data.isSuccess == true) {
    //             callback(data.data)
    //         } else {
    //             callback(null)
    //         }
    //     })
    // }

    // function getSenderInformation(callback) {
    //     request({
    //         url: "https://graph.facebook.com/v2.6/" + event.sender.id,
    //         qs: {
    //             access_token: FACEBOOK_ACCESS_TOKEN,
    //             fields: 'first_name'
    //         },
    //         method: 'GET'
    //     }, function(error, response, body) {
    //         if (!error) {
    //             var bodyObject = JSON.parse(body)
    //             callback(bodyObject.first_name)
    //         }
    //     })
    // }
}