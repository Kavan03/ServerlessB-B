const AWS = require('aws-sdk')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const { Parser } = require('json2csv')

AWS.config.update({
  accessKeyId: 'AKIAV3YS7YLBZUG6QVOQ',
  secretAccessKey: '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',
  region: 'us-east-1',
})

exports.doAnalysis = async (req, res) => {
  let message = req.query.message || req.body.message || 'Hello World!'

  var dbClient = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
  var tableName = 'Tour'

  const scanResults = await scanTable(dbClient, tableName)
  console.log('tour table data===>', JSON.stringify(scanResults))

  var csv = []
  csv.push('placeName,tourTime,tourPrice,placeCity,tourDescription')
  for (let i = 0; i < scanResults.length; i++) {
    var item = scanResults[i]
    csv.push(
      `${item['placeName']},${item['tourTime']},${item['tourPrice']},${item['placeCity']},${item['tourDescription']}`
    )
  }
  console.log('csv table data===>', JSON.stringify(csv))
  const json2csvParser = new Parser()
  const csvResult = json2csvParser.parse(jsonDataArray(csv))
  console.log(JSON.stringify('csv converted data========>', csvResult))

  await storage.bucket('serverlessbnb').file('tourService.csv').save(csvResult)

  res.status(200).send({
    scanResults: csvResult,
    table: tableName,
  })
}

const scanTable = async (dbClient, tableName) => {
  const params = {
    TableName: tableName,
  }

  const scanResults = []
  var items
  do {
    items = await new AWS.DynamoDB.DocumentClient().scan(params).promise()
    items.Items.forEach((item) => scanResults.push(item))
    params.ExclusiveStartKey = items.LastEvaluatedKey
  } while (typeof items.LastEvaluatedKey !== 'undefined')

  return scanResults
}

const jsonDataArray = (array) => {
  var headers = array[0].split(',')
  var jsonData = []
  for (var i = 1, length = array.length; i < length; i++) {
    var row = array[i].split(',')
    var data = {}
    for (var x = 0; x < row.length; x++) {
      data[headers[x]] = row[x]
    }
    jsonData.push(data)
  }
  return jsonData
}
