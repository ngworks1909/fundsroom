import '../css/RefundItem.css'

interface RefundProp{
    key: number | string,
    id: string,
    amount: number | string,
    status: any
}


export default function RefundItem(props: RefundProp) {
    
  return (
    <div className='refund-item display-flex align-center justify-between'>
      <span>{props.id}</span>
      <span>{props.amount}</span>
      <span>{props.status}</span>
    </div>
  )
}
