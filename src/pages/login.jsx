import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const Login = (props) => {
  let navigate = useNavigate()
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Enter your Email ID'),
    password: Yup.string().required('Enter your Password'),
  })
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const { errors } = formState
  async function onSubmit({ email, password }) {
    try {
      const user = await Auth.signIn(email, password)
      props.auth.setUser(user)
      localStorage.setItem('userId', props.auth.user?.username || user.username)
      navigate('/security')
    } catch (error) {
      toast.error('Incorrect Email & Password')
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(props.auth)
    if (props.auth.user) {
      navigate('/home')
    }
  }, [props.auth.isAuthenticated])

  return (
    <div className='flex flex-col items-center justify-center'>
      <Helmet>
        <title>B&B | Login</title>
      </Helmet>
      <div className='justify-center text-center mb-5 text-black text-xl'></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 gap-3 w-full lg:w-96'>
          <div className='flex flex-col'>
            <p className='text-2xl text-center mb-5 text-black font-bold'>
              Login
            </p>
            <label htmlFor='email' className='text-black font-bold text-xl'>
              Username
            </label>
            <input
              className='bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600'
              type='text'
              name='email'
              id='email'
              placeholder='Username'
              {...register('email')}
            />
            <p className='text-red-600'>{errors.email?.message}</p>
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' className='text-black font-bold text-xl'>
              Password
            </label>
            <input
              className='bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600'
              type='password'
              name='password'
              id='password'
              placeholder='Password'
              {...register('password')}
            />
            <p className='text-red-600'>{errors.password?.message}</p>
          </div>
          <button
            className='border-gray-600 text-black border-2 rounded-md font-bold text-xl hover:bg-gray-600 hover:text-white mt-4 p-2'
            type='submit'
          >
            Login
          </button>
          <div className='flex flex-row justify-between font-bold text-black'>
            <Link to='/forgot'>
              <span className='cursor-pointer text-black'>
                Forgot Password?
              </span>
            </Link>
            <Link to='/signup'>
              <span className='cursor-pointer text-black'>Signup</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
