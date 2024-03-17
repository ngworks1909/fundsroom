import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import '../css/Success.css';
import { SuccessState } from '../states/SuccessState';

export default function Success() {
    const navigate = useNavigate();
    const success = useRecoilValue(SuccessState);
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 2000);
        // eslint-disable-next-line
    },[navigate]);
  return (
    <div className=' success display-flex align-center justify-center'>
      <span className='success-text'>{success ? "Success": "Failed"}</span>
    </div>
  )
}
