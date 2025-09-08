type PropsMessage = {
  message: string
}
export default function ErrorComponent({ message }: PropsMessage) {
  return <div>{message}</div>
}
