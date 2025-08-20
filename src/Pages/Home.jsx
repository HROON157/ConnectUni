import { sections, heroContent } from "../Data/homeData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <section className="px-6 py-10 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Optera
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {heroContent.description}
          </motion.p>
        </div>
      </section>

      {sections.map((section, index) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ staggerChildren: 0.2 }}
          viewport={{ once: true }}
          className="px-6 sm:px-8 lg:px-12 py-10"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={index % 2 === 0 ? "order-1 lg:order-1" : "order-1 lg:order-2"}>
              <div className="overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="w-full h-72 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className={`order-1 lg:order-${index % 2 === 0 ? "2" : "1"}`}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {section.description}
              </p>
              <button
                onClick={() => navigate(section.buttonRoute)}
                className="px-6 py-3 rounded-xl cursor-pointer font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                {section.buttonText}
              </button>
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default Home;
