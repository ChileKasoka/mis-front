import React from 'react';
import { Link } from 'react-router-dom';
// import { FaHome } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";


function Navbar() {
  return (
    <nav className='flex justify-between'>
      <>
        <div className='ml-20 p-3'>
          <Link><GiHamburgerMenu size={28} color='#566573' className='hover:text-[#85929E]'/></Link>
        </div>
      </>
      <ul className='flex mr-20 my-4'>
        <li className='mr-12'>
          <Link to="/">
            <span className="inline-block rounded-full p-1 hover:bg-[#D6DBDF]">
              <FaBell size={20} className=' text-[#566573] hover:text-[#FFFFFF]'/>
            </span>
          </Link>
        </li>
        <li className='mr-12'>
          <span className="inline-block rounded-full p-1 hover:bg-[#D6DBDF]">
            <Link to="/tasks">
              <FaTasks size={20} className=' text-[#566573] hover:text-[#FFFFFF]'/>
            </Link>
          </span>
        </li>
        <li className='mr-12'>
          <span className="inline-block rounded-full p-1 hover:bg-[#D6DBDF]">
            <Link to="/profile">
              <CgProfile size={20} className=' text-[#566573] hover:text-[#FFFFFF]'/>
            </Link>
          </span>
        </li>
        <li>
        <span className="inline-block rounded-full p-1 hover:bg-[#D6DBDF]">
          <Link to="/logout">
            <IoIosLogOut size={20} className=' text-[#566573] hover:text-[#FFFFFF]'/>
          </Link>
        </span>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
