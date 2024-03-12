import React, {useEffect, useState} from 'react'
import Navbar from './Navbar'
import RefundItem from './RefundItem';
import '../css/Refunds.css'

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                 "auth-token":localStorage.getItem('token')
               }
     }).then(async(response) => {
       const json = await response.json();
       if(json.success){
          setRefunds(json.refunds);
       }
       setLoading(false);
     })
 }, [])
  return (
    <div>
      <Navbar/>
      <div className="refunds display-flex flex-column">
        {!loading &&refunds &&  refunds.map((refund, index) => {
           return <RefundItem key={index} id = {refund.id} amount={refund.amount} status={refund.status}/>
        })}
        {!loading && !refunds && <span>No refunds</span>}
      </div>
    </div>
  )
}
