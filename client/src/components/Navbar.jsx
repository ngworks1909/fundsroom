import React from 'react'
import '../css/Navbar.css'
import {Link, useLocation} from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { LogState } from '../states/LogState';

export default function Navbar() {
  const setLogin = useSetRecoilState(LogState);
  const location = useLocation();
  const handleLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLogin(false);
  }
  return (
    <>
    <div className='nav-bar display-flex align-center justify-between'>
      <div className="left-block display-flex align-center">
         <Link className='nav-logo' to={'/'}>@NGPay</Link>
         <div className="nav-items display-flex">
            <Link to={'/account'} className={`nav-link ${location.pathname === '/account' ? 'active' : ""}`}>Account</Link>
            <Link to={'/refunds'} className={`nav-link ${location.pathname === '/refunds' ? 'active' : ""}`}>Refunds</Link>
         </div>
      </div>
      <div className="right-block">
        <button className='logout-button' onClick={handleLogout}>Logout</button>
      </div>
    </div>
    </>
  )
}
