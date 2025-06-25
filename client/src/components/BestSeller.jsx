import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
    const {products} = useAppContext();
  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'> Best Sellers </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-40 mt-6'> 
            
            {/* Map through best sellers here */}
            {products.filter((products) => products.inStock).slice(0,5).map((products,
              index) => (
                <ProductCard key={index} products={products} />
            ))}
            {/*<ProductCard products = {products[0]}/>*/}
        </div>
      
    </div>
  )
}

export default BestSeller
