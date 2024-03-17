import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Pay.css';
import Navbar from './Navbar';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    
    const handlePay = async(e: React.MouseEvent) => {
        e.preventDefault();    
        try {
            const response = await fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/createAccount`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token") || ""
                },
              body: JSON.stringify({
                "pin":`${pin}`,
              }),
      });
            const json = await response.json();
            if(json.success){
                navigate('/');
            }
        } catch (error) {
            navigate('/createAccount');
        }
    }
  return (
    <div className='pay-wrapper'>
        <Navbar/>
        <div className="pay display-flex align-center justify-center">
            <div className="pay-block display-flex justify-center">
                <div className="pay-container display-flex flex-column gap-1">
                <input type="text" name="amount" className='tsxnamount' maxLength={4} minLength={4} value={pin} onChange={(e) => {
                    e.preventDefault();
                    setPin(e.target.value);
                }} placeholder='Pin' id="tsxnPin" />
                <button className='pay-pay-button' onClick={handlePay}>Create Account</button>
                </div>
            </div>
        </div>
    </div>
  )
}