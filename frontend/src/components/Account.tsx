import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Account.css';
import Navbar from './Navbar';

export default function Account() {
  const initialAcc = {
    accNumber: "000000000000",
    cvv: "000",
    pin: "0000",
    amount: 0
  }
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(initialAcc);
  const username = localStorage.getItem('username');
  const navigate = useNavigate()
  // 
  useEffect(() => {
    fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token") || ""
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
             <span className='card-holder'>{`${username && username[0].toUpperCase()}${username?.substring(1)}`}</span>
             <span className='acc-number'>{`${account.accNumber.substring(0,4)} ${account?.accNumber.substring(4,8)} ${account?.accNumber.substring(8,12)} ${account.accNumber.substring(12,16)}`}</span>
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
