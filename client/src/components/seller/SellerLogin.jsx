import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const SellerLogin = () => {
    const{isSeller,setIsSeller,navigate} = useAppContext()
    const[email,setEmail]= useState('')
    const[password,setPassword]= useState('')

    useEffect(()=>{
        if(isSeller){
            navigate('/seller')
        }
    },[isSeller])
    
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
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-500'>
      <div className='flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-88 m-auto border border-gray-300 rounded-lg shadow-xl'>
      <p className='text-2xl font-medium m-auto'><span className=' text-primary-dull'> Seller</span> Login</p>
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
      
      
      </div>
    </form>
  )
}

export default SellerLogin
