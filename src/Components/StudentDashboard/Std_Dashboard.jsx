const Std_Dashboard = () => {
  const userName = localStorage.getItem('userName');  
  return (
    <div>
      <p>Hello, {userName}</p>
    </div>
  )
}

export default Std_Dashboard