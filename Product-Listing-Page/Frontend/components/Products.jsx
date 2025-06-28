import React, { useState, useEffect } from "react";
import Product from "./Product";

const Products = () => {
    const [price, setPrice] = useState(10000);
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Function to apply filters and sorting
    const getFilteredAndSortedProducts = () => {
        let filteredProducts = [...products];

        // Filter by category
        if (category !== "All") {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }

        // Filter by price (considering discount)
        filteredProducts = filteredProducts.filter(product => {
            const finalPrice = product.price * (100 - (product.disc || 0)) / 100;
            return finalPrice <= price;
        });

        // Apply sorting
        switch (sortBy) {
            case "htol":
                filteredProducts.sort((a, b) => {
                    const priceA = a.price * (100 - (a.disc || 0)) / 100;
                    const priceB = b.price * (100 - (b.disc || 0)) / 100;
                    return priceB - priceA;
                });
                break;
            case "ltoh":
                filteredProducts.sort((a, b) => {
                    const priceA = a.price * (100 - (a.disc || 0)) / 100;
                    const priceB = b.price * (100 - (b.disc || 0)) / 100;
                    return priceA - priceB;
                });
                break;
            case "latest":
                filteredProducts.sort((a, b) => {
                    // Assuming products have a createdAt field or _id can be used for chronological order
                    // If using MongoDB ObjectId, newer objects have larger _id values
                    return b._id.localeCompare(a._id);
                });
                break;
            default:
                // Default sorting (no change)
                break;
        }

        return filteredProducts;
    };

    const filteredAndSortedProducts = getFilteredAndSortedProducts();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="md:grid grid-cols-[20%_80%] p-2 bg-[#FFFFFF] h-screen pt-20">
            {/* filter & sorting options */}
            {/* desktop view */}
            <div className="gap-2 border border-2 border-[#102542] md:text-lg p-2 md:mr-2 mb-2 rounded-lg flex bg-[#CDD7D6] md:flex-col ">
                {/* Sort */}
                <div className="flex md:flex-col items-center gap-2">
                    <span className="font-medium">Sort</span>
                    <select
                        id="sort"
                        name="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-[90%] border rounded-lg shadow-sm bg-white focus:border-[#F87060] outline-none p-1"
                    >
                        <option value="">Default</option>
                        <option value="htol">Price: High to Low</option>
                        <option value="ltoh">Price: Low to High</option>
                        <option value="latest">Latest</option>
                    </select>
                </div>

                {/* Filter */}
                <div className="flex md:flex-col items-center md:mt-6 gap-2">
                    <span className="font-semibold">Filter</span>
                    {/* price filter */}
                    <div className="w-full max-w-md mx-auto">
                        <label htmlFor="price" className="block font-medium text-gray-700">
                            Max Price: <span className="font-semibold text-[#F87060]">₹{price}</span>
                        </label>
                        <input
                            type="range"
                            id="price"
                            name="price"
                            min="100"
                            max="10000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#F87060]"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>₹100</span>
                            <span>₹10,000</span>
                        </div>
                    </div>
                    {/* category filter */}
                    <div className="flex md:flex-col w-[100%]">
                        <span className="text-gray-700 font-medium">Filter by category</span>
                        <select 
                            name="category"
                            id="category"
                            className="border rounded-lg p-1 bg-white focus:border-[#F87060] outline-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Apparels">Apparels</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>
                </div>

                {/* Filter Summary */}
                {/* <div className="mt-4 p-2 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600">
                        <div>Showing {filteredAndSortedProducts.length} of {products.length} products</div>
                        {category !== "All" && (
                            <div className="text-[#F87060] font-medium">Category: {category}</div>
                        )}
                        {price < 10000 && (
                            <div className="text-[#F87060] font-medium">Max Price: ₹{price}</div>
                        )}
                        {sortBy && (
                            <div className="text-[#F87060] font-medium">
                                Sorted by: {
                                    sortBy === "htol" ? "Price (High to Low)" :
                                    sortBy === "ltoh" ? "Price (Low to High)" :
                                    sortBy === "latest" ? "Latest" : "Default"
                                }
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Clear Filters Button */}
                <button
                    onClick={() => {
                        setPrice(10000);
                        setCategory("All");
                        setSortBy("");
                    }}
                    className="mt-2 px-4 py-2 bg-[#F87060] text-white rounded-lg hover:bg-[#e65a4a] transition-colors text-sm"
                >
                    Clear All Filters
                </button>
            </div>

            {/* products */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white overflow-scroll overflow-x-hidden">
                {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map((product) => (
                        <Product key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                        <p className="text-center">
                            Try adjusting your filters or search criteria to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setPrice(10000);
                                setCategory("All");
                                setSortBy("");
                            }}
                            className="mt-4 px-6 py-2 bg-[#F87060] text-white rounded-lg hover:bg-[#e65a4a] transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;