import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home'
import Projects from './Pages/Projects'
import Internships from './Pages/Internships'
import AboutUs from './Pages/AboutUs'
import Login from './Pages/Login'
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App