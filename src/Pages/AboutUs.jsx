import { useState } from 'react';
import { Users, Target, Star, Award, Zap, Globe, Shield, Heart, ChevronDown, ChevronUp, Briefcase, GraduationCap, Lightbulb } from 'lucide-react';
import { FaLinkedin, FaGithub } from "react-icons/fa";
import HaroonPic from "../assets/Haroon Pic.jpg";
import UsmanPic from "../assets/Usman Pic.png";

const AboutUs = () => {
  const [expandedMember, setExpandedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Haroon Shafique",
      role: "Co-Founder | Web Developer | Researcher",
      image: HaroonPic,
      bio: "Driven by a vision to empower students and reduce youth unemployment through technology.",
      expertise: ["React.js", "Tailwind CSS", "Firebase", "Redux Toolkit", "SQL"],
      detailedBio: "I am driven by a vision to empower students and reduce youth unemployment through technology. For the past 2 years, I have been building digital systems that bridge the gap between education and meaningful careers. My journey includes developing impactful web platforms in collaboration with the Government of Punjab, creating solutions that directly address community needs and student challenges.",
      philosophy: "I believe every student who invests time, effort, and resources into education deserves a fair chance at success. In a job market often influenced by references and connections, I am committed to creating transparent, merit-based opportunities where talent defines success.",
      mission: "Through innovation and official recognition of academic and extracurricular achievements, my mission is to level the playing field and ensure job equity for all.",
      linkedin: "https://www.linkedin.com/in/haroon-shafiq-91176726b/",
      github: "https://github.com/HROON157",
      highlights: [
        "Built digital systems bridging education and careers",
        "Collaborated with Government of Punjab on web platforms",
        "Strong expertise in Frontend Development and Databases",
        "Solid foundation in Data Structures and Algorithms"
      ]
    },
    {
      id: 2,
      name: "Usman Ali",
      role: "Co-Founder | AI Enthusiast | Entrepreneur",
      image: UsmanPic,
      bio: "Committed to creating fair opportunities where talent is recognized over privilege.",
      expertise: ["Artificial Intelligence", "Computer Vision", "Research", "Project Management"],
      detailedBio: "To create fair opportunities for young professionals, I want to ensure that talent is recognized over privilege. Over the past few years, I have been involved in building impactful solutions and research-driven projects. My journey includes working with Headstarted, being recognized as a finalist at ITCN Asia, and securing a place among the top candidates in NICF Cohort 5.",
      philosophy: "I believe every student investing time, money, and energy in their degree deserves a fair chance at success, not to be overshadowed by references.",
      mission: "At Optera, my mission is to build systems where top performers receive the recognition and support they deserve, driving job equity and innovation.",
      linkedin: "https://www.linkedin.com/in/osman-aly/",
      github: "https://github.com/osmanaly17",
      highlights: [
        "Contributed to AI and computer vision projects like SyncDeception",
        "Developed EnviroScope (water/land management system)",
        "Presented research at ThinkFest",
        "Finalist at ITCN Asia, top candidate in NICF Cohort 5"
      ]
    },
  ];

  const values = [
    { icon: Heart, title: "Equity", desc: "Creating fair opportunities where talent matters more than connections" },
    { icon: Star, title: "Excellence", desc: "Striving for the highest quality in everything we build" },
    { icon: Zap, title: "Innovation", desc: "Leveraging technology to solve real-world problems" },
    { icon: GraduationCap, title: "Education", desc: "Bridging the gap between learning and career success" },
    { icon: Shield, title: "Transparency", desc: "Ensuring merit-based recognition and opportunities" },
    { icon: Lightbulb, title: "Vision", desc: "Transforming the future of student professional development" }
  ];

  const toggleExpand = (id) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white text-gray-900">
      <section className="py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-sm mb-6 text-blue-700 animate-pulse">
          <Users className="w-4 h-4" />
          About Our Visionaries
        </div>
        <h1 className="text-4xl sm:text-5xl font-giza font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
          The Minds Behind Optera
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We're on a mission to transform university-to-career pathways through technology, 
          ensuring every student's talent is recognized and rewarded.
        </p>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-blue-100 p-8 bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <Target className="w-7 h-7 text-blue-600 mr-2" />
              <h2 className="font-giza text-2xl font-bold text-blue-700">Our Mission</h2>
            </div>
            <p className="text-gray-700">
              To empower students and companies with innovative digital solutions that drive growth, 
              enhance experiences, and create lasting value by bridging the education-career gap.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 p-8 bg-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <Star className="w-7 h-7 text-indigo-600 mr-2" />
              <h2 className="font-giza text-2xl font-bold text-indigo-700">Our Vision</h2>
            </div>
            <p className="text-gray-700">
              To create a world where academic and professional success is determined by merit, 
              talent, and effort—not connections or privilege.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-giza font-bold text-center mb-10 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Our Founding Team
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-800">{member.name}</h3>
                    <p className="text-sm text-indigo-600 mb-2">{member.role}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.expertise.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{skill}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{member.bio}</p>
                    
                    <button
                      onClick={() => toggleExpand(member.id)}
                      className="mt-3 flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {expandedMember === member.id ? (
                        <>
                          Read less <ChevronUp className="w-3 h-3 ml-1" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedMember === member.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">{member.detailedBio}</p>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-blue-800 text-sm mb-1">Key Achievements:</h4>
                      <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                        {member.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 text-sm mb-1">Philosophy:</h4>
                      <p className="text-xs text-gray-600 italic">"{member.philosophy}"</p>
                    </div>
                    
                    <div className="mb-3 p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium text-indigo-800 text-sm mb-1">Mission:</h4>
                      <p className="text-xs text-gray-600">"{member.mission}"</p>
                    </div>
                    
                    <div className="mt-3 flex gap-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded-full flex items-center text-xs font-medium transition-colors hover:bg-blue-200"
                      >
                        <FaLinkedin className="w-4 h-4 mr-1" /> LinkedIn
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-black bg-gray-100 px-3 py-1 rounded-full flex items-center text-xs font-medium transition-colors hover:bg-gray-200"
                      >
                        <FaGithub className="w-4 h-4 mr-1" /> GitHub
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-giza font-bold text-center mb-10 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-blue-50 rounded-2xl border border-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 mb-1 group-hover:text-indigo-700">{value.title}</h3>
                  <p className="text-xs text-gray-600 text-center group-hover:text-gray-700">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <Briefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4">Join Our Mission</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're building a future where every student's potential is recognized and nurtured. 
          Where effort and talent—not connections—determine success.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;