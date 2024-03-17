import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Account.css';
import Navbar from './Navbar';
import logo from '../assets/logo.png'
import chip from '../assets/chip.png'

export default function Account() {
  const capitalizeWords = (sentence:string) => {
    return sentence.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
}
  const initialAcc = {
    accNumber: "000000000000",
    cvv: "000",
    pin: "0000",
    amount: 0
  }
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(initialAcc);
  const navigate = useNavigate()
  const username = capitalizeWords(localStorage.getItem('username') || "");
 
  // 
  useEffect(() => {
    fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token") || ""
      }
    }).then(async (response) => {
      const data = await response.json();
      if (data.success) {
        setAccount(data.account)
      }
      setLoading(false);
      if (!data.success) {
        navigate('/createAccount');
      }
    })
  }, [navigate])
  return (
    <div>
      <Navbar />
      <div className="account display-flex align-center justify-center">
        <div className={`card display-flex flex-column ${loading && 'align-center'}`}>
          {loading ? <span className='color-white'>Loading...</span> : <div className='display-flex flex-column'>
            {/* <span className='card-holder'>{`${username && username[0].toUpperCase()}${username?.substring(1)}`}</span>
            <span className='acc-number'>{`${account.accNumber.substring(0, 4)} ${account?.accNumber.substring(4, 8)} ${account?.accNumber.substring(8, 12)} ${account.accNumber.substring(12, 16)}`}</span>
            <div className="cvv-pin display-flex align-center">
              <span className='cvv'>{`CVV ${account.cvv}`}</span>
              <span className='pin'>{`PIN ${account.pin}`}</span>
            </div>
            <span className='acc-amount'>{`Amount: ${account.amount}`}</span> */}
            <div className="card-header display-flex align-center justify-between">
            <span className='card-logo display-flex align-center justify-center gap-10'>
              <img src={logo} alt="Logo" className='master-logo' />
              <h5 className='master-card-text'>Master Card</h5>
            </span>
            <img src={chip} alt="chip" className='chip-logo' />
            </div>
            <div className="card-details display-flex justify-between align-end">
              <div className="name-number">
                <h6 className="card-number card-label color-white">Card Number</h6>
                <h5 className="card-number card-item color-white">{`${account.accNumber.substring(0, 4)} ${account?.accNumber.substring(4, 8)} ${account?.accNumber.substring(8, 12)} ${account.accNumber.substring(12, 16)}`}</h5>
                <h5 className="card-name card-item color-white">{`${username && username[0].toUpperCase()}${username?.substring(1)}`}</h5>
              </div>
              <div className="validity">
                <h6 className="valid-thru card-label color-white">Valid Thru</h6>
                <h5 className="valid-date card-item color-white">05/28</h5>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}
