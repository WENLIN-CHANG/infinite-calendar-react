import Calendar from './Calendar';

function App() {
  return (
    <div>
      <h1>無限日曆</h1>
      <Calendar />
    </div>
  )
}

function Header(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
    </div>
  )
}

export default App