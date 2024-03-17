import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chip from '../assets/chip.png';
import logo from '../assets/logo.png';
import '../css/Account.css';
import Navbar from './Navbar';

export default function Account() {
  const capitalizeWords = (sentence:string) => {
    return sentence.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
}
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(localStorage.getItem('accNumber') || "");
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
        setAccount(data.account.accNumber)
        localStorage.setItem("accNumber", data.account.accNumber);
      }
      setLoading(false);
      if (!data.success) {
        navigate('/createAccount');
      }
    })
  }, [])
  return (
    <div>
      <Navbar />
      <div className="account display-flex align-center justify-center">
        <div className={`card display-flex flex-column ${loading && 'align-center'}`}>
          {loading ? <span className='color-white'>Loading...</span> : <div className='display-flex flex-column'>
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
                <h5 className="card-number card-item color-white">{`${account.substring(0, 4)} ${account.substring(4, 8)} ${account.substring(8, 12)} ${account.substring(12, 16)}`}</h5>
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
