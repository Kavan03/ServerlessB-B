import { useState, useEffect } from 'react'
import { css } from 'styled-components'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export const mobile = (props) => {
  return css`
    @media only screen and (max-width: 380px) {
      ${props}
    }
  `
}

export const hasToken = () => {
  return localStorage.getItem('accesstoken')
}

export const getUserType = () => {
  return localStorage.getItem('usertype')
}

export const getProfessionalUser = () => {
  const userType = localStorage.getItem('usertype')
  if (hasToken() && userType === 'professional') {
    return localStorage.getItem('professional')
  } else {
    return null
  }
}

export const getCustomerUser = () => {
  const userType = localStorage.getItem('usertype')
  if (hasToken() && userType === 'customer') {
    return localStorage.getItem('customer')
  } else {
    return null
  }
}
