const Wit = require('node-wit').Wit
const witClient = new Wit({
  accessToken: 'QKNC5R5LSLOJYSJU52XXKLWO7IL6GIVS'
}
)

module.exports = (request, response) => {
  var message = request.body.userMessage
  witClient.message(message, {}).then((returnData) => {
    var returnMessage = {
      isSuccess: true,
      message: 'Call Wit.ai successful',
      data: returnData
    }
    response.json(returnMessage)
  }).catch((err) => {
    var returnMessage = {
      isSuccess: false,
      message: err
    }
    response.json(returnMessage)
  })
}