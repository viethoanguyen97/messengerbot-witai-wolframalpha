const Wit = require('node-wit').Wit
const witClient = new Wit({
  accessToken: '3KQX5ICVNIAQI3KOCXF72C3CMKMXNRFR'
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