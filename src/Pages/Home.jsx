import Studentimage from "../assets/Student_Pic.jpeg.jpg"
import Companyimage from "../assets/Companies.jpeg.jpg"

const Home = () => {
  const sections = [
    {
      id: 'students',
      title: 'For Students',
      description: 'Explore a wide range of projects and internships tailored to your skills and interests. Build your portfolio, gain valuable experience, and connect with leading companies.',
      buttonText: 'Create Student Profile',
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
      image: Companyimage,
      imageAlt: 'Business professionals collaborating',
      sectionClass: 'px-4 sm:px-6 lg:px-32 py-4',
      gap: 'gap-8 lg:gap-12'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <section className="px-4 sm:px-4 lg:px-4 py-5 lg:py-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0D141C] mb-6 leading-tight">
              Welcome to <span className="text-[#1E90FF]">ConnectUni</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-1xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              ConnectUni is a platform designed to connect university students
              with opportunities in projects and internships. Our mission is to
              bridge the gap between academic knowledge and real-world
              experience.
            </p>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.id} className={section.sectionClass}>
          <div className="max-w-7xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 ${section.gap} items-center`}>
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-1xl sm:text-2xl font-bold text-[#0D141C] mb-4">
                  {section.title}
                </h2>
                <p className="text-lg text-[#4F7096] mb-6 leading-relaxed">
                  {section.description}
                </p>
                <button className="bg-[#1E90FF] text-white px-2 py-1 rounded-lg font-semibold cursor-pointer">
                  {section.buttonText}
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Home