import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Chatbot from '../components/ChatBot'
import NotFound from '../pages/404'

const Orders = (props) => {
  const [rooms, setRooms] = useState({})
  const [food, setFood] = useState({})

  const fetchDetails = async () => {
    // let userId ='82178782112'
    let userId = localStorage.getItem('userId')
    const r = await axios
      .get(
        'https://iwna4wu91b.execute-api.us-east-1.amazonaws.com/rooms/' + userId
      )
      .catch((err) => {
        console.log(err)
      })

    setRooms(r.data)

    // let id = '7217721781221'
    let id = localStorage.getItem('userId')
    const r2 = await axios
      .get(
        'https://iwna4wu91b.execute-api.us-east-1.amazonaws.com/kitchen/' + id
      )
      .catch((err) => {
        console.log(err)
      })

    // console.log(userId)
    setFood(r2.data)
  }

  useEffect(() => {
    fetchDetails()

    console.log(food)
    console.log(rooms)
  }, [])

  return (
    <div className='container'>
      <div
        className='card container'
        style={{
          width: 18 + 'rem',
          top: 5 + 'rem',
          position: 'relative',
          right: 420 + 'px',
        }}
      >
        <div className='card-body'>
          <h5 className='card-title'>ROOMS BOOKED : {rooms.Count} </h5>
          <img
            className='card-img-top'
            src='https://source.unsplash.com/1x1?hotel,rooms'
            alt='Card image cap'
          />
          {rooms.Items !== undefined && rooms.Items.length > 0 ? (
            <>
              <p className='card-title'>
                NUMBER : <nbsp />
                {rooms.Items[rooms.Count - 1].number.S} , ...
              </p>

              <p className='card-title'>
                TYPE : <nbsp />
                {rooms.Items[rooms.Count - 1].type.S} , ...
              </p>

              <p className='card-title'>
                COST : <nbsp />
                {rooms.Items[rooms.Count - 1].cost.S} , ...
              </p>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div
        className='card container'
        style={{
          width: 18 + 'rem',
          top: 5 + 'rem',
          position: 'relative',
          left: 10 + 'px',
          top: -280 + 'px',
        }}
      >
        <div className='card-body'>
          <h5 className='card-title'>KITCHEN ORDERS : {food.Count}</h5>
          <img
            className='card-img-top'
            src='https://source.unsplash.com/1x1?food'
            alt='Card image cap'
          />
          {food.Items != undefined && food.Items.length > 0 ? (
            <>
              <p className='card-title'>
                DISHES : <nbsp />
                {food.Items[food.Count - 1].dish.S} , ...
              </p>

              <p className='card-title'>
                COST : <nbsp />
                {food.Items[food.Count - 1].cost.S} , ...
              </p>

              <p className='card-title'>
                QUANTITY : <nbsp />
                {food.Items[food.Count - 1].quantity.S} , ...
              </p>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 5,
          top: 200,
        }}
      >
        <Chatbot />
      </div>
    </div>
  )
}

export default Orders
