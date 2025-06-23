import React from "react";
import { CircleUserRound, Heart, Home, Menu, ShoppingCart } from "lucide-react";
import { useMediaQuery } from 'react-responsive';

const Navbar = () => {
  const buttons = [
    {
        key: "home",
        title: "Home",
        link: "",
    },
    {
        key: "products",
        title: "Products",
        link: "",
    },
    {
        key: "offers",
        title: "Offers",
        link: "",
    },
    {
        key: "about",
        title: "About",
        link: "",
    },
  ];
  const isMobile = useMediaQuery({maxWidth: 767})
  return (
    <nav className="fixed top-0 right-0 left-0 border-b backdrop-blur-md transition-all duration-300 bg-[#102542] text-[#CDD7D6]">
      <div className="px-6 py-4">
        {/* Desktop layout */}
        <div className="flex items-center justify-between">
            {/* home button - left */}
            <button className="flex items-center gap-5 text-xl cursor-pointer">
                <img
                src="../public/amazon-color-svgrepo-com.svg"
                className="w-10"
                alt="logo"
                />
                <span>Amajon</span>
            </button>

            {/* other buttons */}
            <div className="hidden md:flex items-center justify-between gap-28 ">
                {buttons.map((b) => {
                    return(
                        <button className="cursor-pointer hover:text-[#F87060]"
                        key={b.key}
                        >
                            {b.title}
                        </button>
                    )
                })}
            </div>
            
            {/* profile, wishlist, cart buttons */}
            <div className="flex items-center justify-between gap-4 md:gap-10">
                {/* wishlist button */}
                <button className="cursor-pointer">
                    <Heart size={isMobile ? 25 : 30}/>
                </button>

                {/* Cart button */}
                <button className="cursor-pointer relative">
                    <ShoppingCart size={isMobile ? 25 : 30} />
                    <div className="absolute flex items-center bg-[#F87060] px-2 rounded-full text-black bottom-4 left-3">5</div>
                </button>

                {/* profile button */}
                <button className=" cursor-pointer">
                    <CircleUserRound size={isMobile ? 25 : 30}/>
                </button>

                {/* hamburger */}
                <button className="cursor-pointer md:hidden">
                    <Menu size={isMobile ? 25 : 30}/> 
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
