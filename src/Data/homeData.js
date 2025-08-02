import Studentimage from "../assets/Student_Pic.jpeg.jpg"
import Companyimage from "../assets/Companies.jpeg.jpg"

export const sections = [
  {
    id: 'students',
    title: 'For Students',
    description: 'Explore a wide range of projects and internships tailored to your skills and interests. Build your portfolio, gain valuable experience, and connect with leading companies.',
    buttonText: 'Create Student Profile',
    buttonRoute: '/student-signup',
    image: Studentimage,
    imageAlt: 'Student working on laptop',
    sectionClass: 'px-4 sm:px-6 lg:px-32 py-1',
    gap: 'gap-3 lg:gap-6'
  },
  {
    id: 'companies',
    title: 'For Companies', 
    description: 'Find talented students to work on your projects and internships. Post opportunities, review applications, and connect with the next generation of professionals.',
    buttonText: 'Create Company Profile',
    buttonRoute: '/hr-signup',
    image: Companyimage,
    imageAlt: 'Business professionals collaborating',
    sectionClass: 'px-4 sm:px-6 lg:px-32 py-4',
    gap: 'gap-8 lg:gap-12'
  }
]

export const heroContent = {
  title: 'Welcome to ConnectUni',
  description: 'ConnectUni is a platform designed to connect university students with opportunities in projects and internships. Our mission is to bridge the gap between academic knowledge and real-world experience.'
}