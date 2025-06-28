import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import MegaMart from '../../assets/MegaMart.png'

const SellerLogin = () => {
    const { isSeller, setIsSeller } = useAppContext()
    const navigate = useNavigate()
    const[email,setEmail]= useState('admin@example.com')
    const[password,setPassword]= useState('greatstack123')

    useEffect(() => {
        if (isSeller) navigate('/seller')
    }, [isSeller, navigate])
    
    const onSubmitHandler = async (e) => {
        try{
          e.preventDefault();
          const {data} = await axios.post('api/seller/login',{email,password})
          if(data.success){
            setIsSeller(true)
            toast.success(data.message)
            navigate('/seller')
          }else{
            toast.error(data.message)
          }
        } catch(error) {
          toast.error(error.message)

        }
    }

  return !isSeller && (
    <div className='min-h-screen flex items-center text-sm text-gray-600 relative'>
      <img src={MegaMart} alt='MegaMart Logo' className='h-12 fixed top-4 left-4 cursor-pointer' onClick={() => navigate('/')} />
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
        <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
          type='text' placeholder='Enter Email' className='border border-gray-300 rounded w-full p-2 mt-1 outline-primary'required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
          type='password' placeholder='Enter Password'className='border border-gray-300 rounded w-full p-2 mt-1 outline-primary'required/>
        </div>
        <button className=' bg-primary text-white w-full py-2 rounded-md cursor-pointer'>Login Seller</button>
      </form>
    </div>
  )
}

export default SellerLogin
