import React, { useState } from 'react'
import Navbar from './Navbar'
import '../css/Pay.css'
import {useNavigate} from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PayState } from '../states/PayState';
import { AmountState } from '../states/AmountState';
import { SuccessState } from '../states/SuccessState';

export default function Pin() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const receiver = useRecoilValue(PayState);
    const amount = useRecoilValue(AmountState);
    const setSuccess = useSetRecoilState(SuccessState);
    const [loading, setLoading] = useState(false)
    
    const handlePay = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://backend.nithin-kanduru1908.workers.dev/api/transactions/makePayment`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token")
                },
              body: JSON.stringify({
                "receiverUserId":`${receiver}`,
                "tsxnAmount": amount
              }),
      });
            const json = await response.json();
            setLoading(false)
            if(!json.success){
                navigate('/success');
            }
            else{
                setSuccess(true);
                navigate('/success');
            }
        } catch (error) {
            setSuccess(false)
            navigate('/success');
        }
    }
  return (
    <div className='pay-wrapper'>
        <Navbar/>
        {!loading && <div className="pay display-flex align-center justify-center">
            <div className="pay-block display-flex justify-center">
                <div className="pay-container display-flex flex-column gap-1">
                <input type="text" name="amount" className='tsxnamount' maxLength={4} minLength={4} value={pin} onChange={(e) => {
                    e.preventDefault();
                    setPin(e.target.value);
                }} placeholder='Pin' id="tsxnPin" />
                <button className='pay-pay-button' onClick={handlePay}>Pay</button>
                </div>
            </div>
        </div>}
        <div className="display-flex align-center-justify-center">
           {loading && <span>Please wait...</span>}
        </div>
    </div>
  )
}