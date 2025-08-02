import { sections, heroContent } from '../data/homeData'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <section className="px-4 sm:px-4 lg:px-4 py-5 lg:py-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0D141C] mb-6 leading-tight">
              Welcome to <span className="text-[#1E90FF]">ConnectUni</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-1xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {heroContent.description}
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
                <button 
                  onClick={()=> navigate(section.buttonRoute)} 
                  className="bg-[#1E90FF] text-white px-2 py-1 rounded-lg font-semibold cursor-pointer">
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