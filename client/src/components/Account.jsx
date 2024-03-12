import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import '../css/Account.css'
import {useNavigate} from 'react-router-dom'

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const username = localStorage.getItem('username');
  const navigate = useNavigate()
  // 
  useEffect(() => {
    fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token")
                }
        }).then(async(response) => {
            const data = await response.json();
            if(data.success){
                setAccount(data.account)
            }
            setLoading(false);
            if(!data.success){
              navigate('/createAccount');
            }
        })
  }, [navigate])
  return (
    <div>
      <Navbar/>
      {!loading && <div className="account display-flex align-center justify-center">
          <div className="card display-flex flex-column align-center justify-center gap-10">
             <span className='card-holder'>{`${username[0].toUpperCase()}${username.substring(1)}`}</span>
             <span className='acc-number'>{`${account.accNumber.substring(0,4)} ${account.accNumber.substring(4,8)} ${account.accNumber.substring(8,12)} ${account.accNumber.substring(12,16)}`}</span>
             <div className="cvv-pin display-flex align-center gap-10">
             <span className='cvv'>{`CVV ${account.cvv}`}</span>
             <span className='pin'>{`PIN ${account.pin}`}</span>
             </div>
             <span className='acc-amount'>{`Amount: ${account.amount}`}</span>
          </div>
      </div>}
    </div>
  )
}
