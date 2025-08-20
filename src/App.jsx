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
import Student_Profile from './Components/StudentDashboard/Student_Profile'
import { AuthProvider } from './Context/Context'
import PastApplications from './Components/StudentDashboard/PastApplications'
import ActiveApplications from './Components/StudentDashboard/ActiveApplications'
import Companies from './Components/CompanyProfile/Companies'
import Systems from "./Components/CompanyProfile/Systems"
import Netsol from "./Components/CompanyProfile/Netsol"
import Messages from './Components/Messages/Messages'
import ProtectedRoute from "./Pages/ProtectedRoute"

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
            <Route path='/browse-universities' element={<Uni_Home />} />
            <Route path='/bnu-profile' element={<BNU_Profile />} />
            <Route path='/umt-profile' element={<UMT_Profile />} />
            <Route path='browse-companies' element={<Companies/>}/>
            <Route path="/company/systems" element={<Systems />} />
            <Route path="/company/netsol" element={<Netsol />} />
            <Route path="/messages" element={<Messages />} />

            {/* Student Protected Routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/student-profile' 
              element={
                <ProtectedRoute requiredRole="student">
                  <Student_Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='past-applications' 
              element={
                <ProtectedRoute requiredRole="student">
                  <PastApplications/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='active-applications' 
              element={
                <ProtectedRoute requiredRole="student">
                  <ActiveApplications/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/hr-dashboard" 
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-new-opening" 
              element={
                <ProtectedRoute requiredRole="hr">
                  <New_Openings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/past-openings' 
              element={
                <ProtectedRoute requiredRole="hr">
                  <PastOpening />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/hr-profile' 
              element={
                <ProtectedRoute requiredRole="hr">
                  <HR_Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App