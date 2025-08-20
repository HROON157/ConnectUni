import { useState } from 'react';
import { Users, Target, Star, Award, Zap, Globe, Shield, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { FaLinkedin, FaGithub } from "react-icons/fa";
import HaroonPic from "../assets/Haroon Pic.jpg";
import UsmanPic from "../assets/Usman Pic.png";

const AboutUs = () => {
  const [expandedMember, setExpandedMember] = useState(null);

  const teamMembers = [
    {
      id: 2,
      name: "Muhammad Haroon Shafiq",
      role: "Frontend Developer",
      image: HaroonPic,
      bio: "Tech architect and problem solver, dedicated to building scalable solutions that drive business growth.",
      expertise: ["React", "Firebase", "Tailwind CSS"],
      detailedBio: "Haroon worked on building interactive UI components using React and implemented user-friendly navigation across the platform and handled the backend with firebase integration. He specializes in creating performant, accessible web applications with modern frameworks.",
      linkedin: "https://www.linkedin.com/in/haroon-shafiq-91176726b/",
      github: "https://github.com/HROON157"
    },
    {
      id: 3,
      name: "Usman Ali",
      role: "UI/UX Designer",
      image: UsmanPic,
      bio: "Creative director with a passion for user-centered design and creating intuitive digital experiences.",
      expertise: ["Figma", "UI/UX", "Branding"],
      detailedBio: "Usman Ali led the design efforts using Figma and implemented clean layouts, enhancing the user experience and project presentation. He focuses on creating visually appealing interfaces that prioritize usability and aesthetic consistency across platforms.",
      linkedin: "https://www.linkedin.com/in/osman-aly/",
      github: "https://github.com/osmanaly17",
    },
  ];

  const values = [
    { icon: Heart, title: "Client-Centric", desc: "We put our clients' success at the heart of everything we do." },
    { icon: Star, title: "Excellence", desc: "We strive for perfection in every project." },
    { icon: Zap, title: "Innovation", desc: "We embrace creative solutions and new technologies." },
    { icon: Globe, title: "Global Impact", desc: "We aim to make a positive difference worldwide." },
    { icon: Shield, title: "Integrity", desc: "We operate with honesty and transparency." },
    { icon: Award, title: "Recognition", desc: "Our commitment has earned us client trust." }
  ];

  const toggleExpand = (id) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white text-gray-900">
      <section className="py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-sm mb-6 text-blue-700 animate-pulse">
          <Users className="w-4 h-4" />
          About Our Team
        </div>
        <h1 className="text-4xl sm:text-5xl font-giza font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Meet the Team Behind Optera
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We are a passionate group of innovators, designers, and strategists dedicated to building a better university experience for everyone.
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
              To empower students and companies with innovative digital solutions that drive growth, enhance experiences, and create lasting value.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 p-8 bg-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <Star className="w-7 h-7 text-indigo-600 mr-2" />
              <h2 className="font-giza text-2xl font-bold text-indigo-700">Our Vision</h2>
            </div>
            <p className="text-gray-700">
              To be the leading platform for university connections, recognized for our innovation, quality, and commitment to student and company success.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-giza font-bold text-center mb-10 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Our Team
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
                    <p className="text-sm text-gray-600">{member.detailedBio}</p>
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
    </div>
  );
};

export default AboutUs;