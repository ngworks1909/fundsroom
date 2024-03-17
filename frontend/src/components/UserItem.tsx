import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import '../css/UserItem.css';
import { PayState } from '../states/PayState';
import { User } from './UserList';


interface UserProps{
    key: number,
    user: User
}

export default function UserItem(props: UserProps ) {
  const user = props.user;
  const navigate = useNavigate();
  const setPay = useSetRecoilState(PayState)
  const handlePay = (userId: string) => {
    setPay(userId);
    navigate("/pay")
  }
  return (
    <div className="user-item display-flex align-center justify-between">
      <div className="user-left-block display-flex align-center">
         <div className="user-item-icon display-flex align-center justify-center">
           <span className='span-logo'>{user.username[0].toUpperCase()}</span>
         </div>
         <div className="user-left-details display-flex flex-column ">
          <span className='user-username'>{`${user.username.substring(0,1).toUpperCase()}${user.username.substring(1)}`}</span>
          <span className='user-mobile'>{`${user.mobile.substring(0,2)}XXXXXX${user.mobile.substring(8)}`}</span>
         </div>
      </div>
      <div className="user-right-block">
        <button className='pay-user-button' onClick={(e) => {e.preventDefault();handlePay(user.userId)}}>Pay</button>
      </div>
    </div>
  )
}
