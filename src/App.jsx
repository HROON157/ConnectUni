import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import New_Openings from './Components/HRDashbaord/New_Openings'
import Uni_Home from './Components/UniProfile/Uni_Home'
import BNU_Profile from './Components/UniProfile/BNU_Profile'
import UMT_Profile from './Components/UniProfile/UMT_Profile'
import PastOpening from './Components/HRDashbaord/PastOpening'
import HR_Profile from './Components/HRDashbaord/HR_Profile'
import { AuthProvider } from './Context/Context'
function App() {
  return (
    <AuthProvider>
      <Router>
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
            <Route path="/add-new-opening" element={<New_Openings />} />
            <Route path='/browse-universities' element={<Uni_Home />} />
            <Route path='/bnu-profile' element={<BNU_Profile />} />
            <Route path='/umt-profile' element={<UMT_Profile />} />
            <Route path='/past-openings' element={<PastOpening />} />
            <Route path='/hr-profile' element={<HR_Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App