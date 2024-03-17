import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import '../css/Pay.css';
import { AmountState } from '../states/AmountState';
import { PayState } from '../states/PayState';
import { SuccessState } from '../states/SuccessState';
import Navbar from './Navbar';

export default function Pin() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const receiver = useRecoilValue(PayState);
    const amount = useRecoilValue(AmountState);
    const setSuccess = useSetRecoilState(SuccessState);
    const [loading, setLoading] = useState(false)
    
    const handlePay = async(e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://backend.nithin-kanduru1908.workers.dev/api/transactions/makePayment`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token") || ""
                },
              body: JSON.stringify({
                "receiverUserId":`${receiver}`,
                "tsxnAmount": amount
              }),
      });
            const json = await response.json();
            if(!json.success){
                setSuccess(false);
                setLoading(false)
                navigate('/success');
            }
            else{
                setSuccess(true);
                setLoading(false)
                navigate('/success');
            }
        } catch (error) {
            setSuccess(false);
            setLoading(false);
            navigate('/success');
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
                <button className={`pay-pay-button ${loading && 'pay-opacity'}`} onClick={handlePay}>Pay</button>
                </div>
            </div>
        </div>
    </div>
  )
}