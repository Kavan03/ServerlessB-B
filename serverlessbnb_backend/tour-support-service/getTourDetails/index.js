const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()

exports.helloWorld = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  }

  var placeCity = req.query.placeCity || req.body.placeCity || 'Ottawa'
  var tourTime = req.query.tourTime || req.body.tourTime || 3

  async function createModel() {
    var datasetId = 'assingment4_dataset'
    var modelId = 'model'
    const table = 'tourservice'

    const query = `SELECT
    *
  FROM
    ML.PREDICT (MODEL \`${datasetId}.${modelId}\`,
      (
      SELECT
        *
      FROM
        \`${datasetId}.${table}\`
        WHERE placeCity='${placeCity}' and tourTime=${tourTime}
       )
    )`

    const queryOptions = {
      query: query,
    }
    const [job] = await bigquery.createQueryJob(queryOptions)
    const result = await job.getQueryResults()
    console.log(result)
    res.status(200).send({
      tourRecommendations: result,
    })
  }
  createModel()
}
