import React from 'react'
import { Helmet } from 'react-helmet'
import InputLabel from '@mui/material/InputLabel'
import { MenuItem } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import * as MENU from '../utils/constant'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import NotFound from './404'
import { toast } from 'react-toastify'

function Tour(props) {
  const [placeCity, setPlaceCity] = React.useState('')
  const [tourTime, setTourTime] = React.useState('')
  const [tours, setTours] = React.useState([])
  const [isRequested, setIsRequest] = React.useState(false)

  function getTourDetail(placeCity, tourTime) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      var raw = JSON.stringify({
        placeCity: placeCity,
        tourTime: tourTime,
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(
        'https://us-central1-serverless-assignment-352803.cloudfunctions.net/getTourDetails',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => console.log('error', error))
    })
  }

  function getConfirmation(placeName, placeCity, tourPrice, tourTime) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      var raw = JSON.stringify({
        userName: props.auth.user.username,
        userEmail: props.auth.user.attributes.email,
        placeCity: placeCity,
        placeName: placeName,
        tourTime: tourTime,
        tourPrice: tourPrice,
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }
      fetch(
        'https://v3g7n6d4lkqegbryqkaqljnoma0mukzy.lambda-url.us-east-1.on.aws/',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success('Booking Confirmation sent to registered emailID')
            resolve(result)
          }
        })
        .catch((error) => console.log('error', error))
    })
  }
  async function onhandleBook(placeName, placeCity, tourPrice, tourTime) {
    await getConfirmation(placeName, placeCity, tourPrice, tourTime)
  }
  async function onSubmit(e) {
    e.preventDefault()
    const result = []
    getTourDetail(placeCity, tourTime).then((res) => {
      res?.tourRecommendations[0].forEach((item) => {
        const index = result.findIndex((i) => i.placeName === item.placeName)
        if (index === -1) {
          result.push(item)
        }
      })
      setIsRequest(true)
      setTours(result)
    })
  }
  if (props.auth.user) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <Helmet>
          <title>B&B | Signup</title>
        </Helmet>

        <form onSubmit={(e) => onSubmit(e)}>
          <div className='grid grid-cols-1 gap-3 w-full lg:w-96'>
            <div className='flex flex-col mb-2'>
              <p className='text-2xl text-center mb-5 text-black font-bold'>
                Search Tour
              </p>
            </div>
            <label className='text-black font-bold text-xl'>Select City</label>
            <FormControl sx={{ borderColor: 'black' }} size='small'>
              <InputLabel id='demo-select-small'>Select City</InputLabel>
              <Select
                labelId='demo-select-small'
                id='demo-select-small'
                value={placeCity}
                label='Select City'
                onChange={(e) => {
                  setPlaceCity(e.target.value)
                }}
              >
                {MENU.CITIES.map((placeCity, index) => (
                  <MenuItem value={placeCity}>{placeCity}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <label className='text-black font-bold text-xl'>Select Days</label>

            <FormControl sx={{ borderColor: 'black' }} size='small'>
              <InputLabel id='demo-select-small'>Select Days</InputLabel>
              <Select
                labelId='demo-select-small'
                id='demo-select-small'
                value={tourTime}
                label='Select Days'
                onChange={(e) => {
                  setTourTime(e.target.value)
                }}
              >
                {MENU.DAYS.map((tourTime, index) => (
                  <MenuItem value={tourTime}>{tourTime}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
              className='border-gray-600 text-black border-2 rounded-md font-bold text-xl hover:bg-gray-600 hover:text-white mt-4 p-2'
              type='submit'
            >
              Submit
            </button>
          </div>
        </form>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className='mt-4'
        >
          {tours.length > 0
            ? tours.map((item, index) => {
                return (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Typography variant='h5' component='div'>
                          {item.placeName}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                          {item.placeCity}
                        </Typography>
                        <Typography variant='body2'>
                          $: {item.tourPrice}
                        </Typography>
                        <Typography variant='body2'>
                          Days: {item.tourTime}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          className='text-red'
                          onClick={() =>
                            onhandleBook(
                              item.placeName,
                              item.placeCity,
                              item.tourPrice,
                              item.tourTime
                            )
                          }
                          size='small'
                        >
                          Book
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })
            : isRequested && (
                <Grid item xs={12} className='mt-4'>
                  <h1 className='text-xl justify-center text-center mb-5 text-black font-bold'>
                    No tours found
                  </h1>
                </Grid>
              )}
        </Grid>
      </div>
    )
  }
  return <NotFound />
}

export default Tour
