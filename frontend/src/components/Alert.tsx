import '../css/Alert.css'

interface Properties{
    type: string,
    message: string
}

export default function Alert(props: Properties) {
  return (
    <div className={`alert alert-${props.type}`} role="alert">
       {props.message}
   </div>
  )
}