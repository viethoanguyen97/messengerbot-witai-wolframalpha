//xac thuc khi fb goi qua duong dan server
module.exports = (request, response) => {
    const hubChallenge = request.query['hub.challenge']
    const hubMode = request.query['hub.mode']
    const verifyTokenMatches = (request.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN)

    if (hubMode && verifyTokenMatches) {
        response.status(200).send(hubChallenge)
    } else {
        response.status(403).end()
    }
}