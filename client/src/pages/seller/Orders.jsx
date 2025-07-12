import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders} from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
    const{currency,axios} = useAppContext()
    const[orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
       try{
            console.log('Fetching seller orders...'); // Debug log
            const{data}=await axios.get('/api/order/seller');
            console.log('Seller orders response:', data); // Debug log
            if(data.success){
                console.log('Seller orders found:', data.orders.length); // Debug log
                setOrders(data.orders)
             }
             else{
                console.error('Failed to fetch orders:', data.message);
                toast.error(data.message)
             }
       }catch(error){
        console.error('Error fetching orders:', error.message);
        toast.error(error.message)
       }
    }, [axios]);
    useEffect(()=>{
        fetchOrders();
    },[fetchOrders])


  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md 
                border border-gray-300">
                    <div className="flex gap-5 max-w-80">
                        <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                        <div>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <p className="font-medium">
                                        {item.product.name} {" "}
                                        <span className="text-primary">x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm md:text-base text-black/60">
                        {/* Debug what address looks like */}
                        {console.log('Order address:', order.address)}
                        
                        {order.address && typeof order.address === 'object' ? (
                            <>
                                <p className='text-black/80 font-medium'>
                                    {order.address.firstName && order.address.lastName 
                                        ? `${order.address.firstName} ${order.address.lastName}`
                                        : 'Customer Name Not Available'
                                    }
                                </p>
                                <p>{order.address.street || 'Street not available'}</p>
                                <p>
                                    {order.address.city || 'City'}, {order.address.state || 'State'}, {order.address.zipcode || 'ZIP'}
                                </p>
                                <p>{order.address.country || 'Country'}</p>
                                {order.address.phone && <p>Phone: {order.address.phone}</p>}
                            </>
                        ) : (
                            <p className='text-black/80'>Address ID: {order.address}</p>
                        )}

                    </div>

                    <p className="font-medium text-lg my-auto ">
                    {currency}{order.amount}</p>

                    <div className="flex flex-col text-sm md:text-base text-black/60">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Orders
