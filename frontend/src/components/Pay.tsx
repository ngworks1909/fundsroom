import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import '../css/Pay.css'
import { AmountState } from '../states/AmountState'
import Navbar from './Navbar'

export default function Pay() {
    const navigate = useNavigate();
    const setAmount = useSetRecoilState(AmountState);
  return (
    <div className='pay-wrapper'>
        <Navbar/>
        <div className="pay display-flex align-center justify-center">
            <div className="pay-block display-flex justify-center">
                <div className="pay-container display-flex flex-column gap-1">
                <input type="text" name="amount" className='tsxnamount' maxLength={7} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setAmount(e.target.value);
                }}  placeholder='Amount' id="tsxnAmount" />
                <button className='pay-pay-button' onClick={() => {
                    navigate('/pin')
                }}>Pay</button>
                </div>
            </div>
        </div>
    </div>
  )
}