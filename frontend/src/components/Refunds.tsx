import { useEffect, useState } from 'react';
import '../css/Refunds.css';
import Navbar from './Navbar';
import RefundItem from './RefundItem';

export interface Refund{
    id: string,
    amount: number | string,
    status: any
  }
export default function Refunds() {

  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                 "auth-token":localStorage.getItem('token') || ""
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
      <div className="refunds-wrapper">
      <div className="refunds display-flex flex-column">
        {!loading && refunds &&  <div className='display-flex flex-column gap-10'>
          <RefundItem key={"id"} id = {"ID"} amount={"AMOUNT"} status={"STATUS"}/>
          {refunds.map((refund:Refund, index) => {
           return <RefundItem key={index} id = {refund.id} amount={refund.amount} status={refund.status}/>
        })}
          </div>}
        {!loading && !refunds && <span>No refunds</span>}
      </div>
      </div>
    </div>
  )
}
