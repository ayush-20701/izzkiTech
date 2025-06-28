import React from "react";

const Product = ({product}) => {
  
  const finalPrice = (price, dis)=>{
      return Math.round(price - ((price/100) * dis))
  }
  return (
    <div className="bg-[#CDD7D6] shadow rounded-lg md:h-[30rem] h-auto flex flex-col">
      {/* Product Image*/}
      <img
        src={product.imgUrl}
        alt="Product"
        className="w-full h-40 md:h-48 object-cover rounded-t-lg"
      />

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        {/* Title */}
        <h2 className="text-base md:text-xl font-semibold text-[#102542]">
          {product.title}
        </h2>

        {/* Category */}
        <span className="text-xs bg-[#102542] text-white px-2 py-1 rounded-full w-fit mt-1">
          {product.category}
        </span>

        {/* Rating */}
        <div className="flex items-center space-x-1 text-yellow-500 text-sm mt-1">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-gray-400">★</span>
          <span className="text-xs text-gray-600 ml-1">(120)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-2 md:line-clamp-3">
          {product.desc}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg md:text-xl font-bold text-[#F87060]">
              {finalPrice(product.price, product.disc)}
            </span>
            <span className="text-sm line-through text-gray-500">{product.price}</span>
          </div>
          <span className="bg-[#F87060] text-white text-xs px-2 py-1 rounded-full">
            {product.disc}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
