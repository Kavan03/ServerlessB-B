var req = require('request')

exports.handler = async (event, context, callback) => {
  var placeCity = event.currentIntent.slots.placeCity
  var tourTime = event.currentIntent.slots.tourTime

  var result = await getTourDetails(placeCity, tourTime)
  result = result?.tourRecommendations[0]
    .map((itme) => {
      return `${itme.placeName} => ${itme.tourPrice}`
    })
    .join('\n')
  console.log('response===>', result)

  callback(null, {
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: result.length > 0 ? result : 'No tour found',
      },
    },
  })
}

const getTourDetails = async (placeCity, tourTime) => {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify({
      placeCity: placeCity,
      tourTime: tourTime,
    })

    const params = {
      url: 'https://us-central1-serverless-assignment-352803.cloudfunctions.net/getTourDetails',
      headers: {
        'Content-Type': 'application/json',
      },
      json: JSON.parse(data),
    }
    req.post(params, function (err, res, body) {
      if (err) {
        console.log('------error------', err)
      } else {
        console.log('------success--------', body)
        resolve(body)
      }
    })
  })
}
