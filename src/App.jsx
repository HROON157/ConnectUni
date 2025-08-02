import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home'
import Projects from './Pages/Projects'
import Internships from './Pages/Internships'
import AboutUs from './Pages/AboutUs'
import Login from './Pages/Login'
import StudentSignup from './Pages/StudentSignup'
import CompanySignup from './Pages/CompanySignup'
import "react-toastify/dist/ReactToastify.css";
import StudentDashboard from './Components/StudentDashboard/Std_Dashboard'
import HRDashboard from './Components/HRDashbaord/HR_Dashboard'
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
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/hr-signup" element={<CompanySignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
        </Routes>
        
      </div>
    </BrowserRouter>
  )
}

export default App