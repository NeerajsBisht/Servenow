"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();

  const services = [
    {
      icon: "🚗",
      title: "Vehicle Services",
      desc: "Car wash, maintenance, and transportation help",
    },
    {
      icon: "🎓",
      title: "Tutoring & Education",
      desc: "Personal tutors for any subject, any duration",
    },
    {
      icon: "💊",
      title: "Medical Assistance",
      desc: "Medicine delivery and health support services",
    },
    {
      icon: "🏠",
      title: "Household Tasks",
      desc: "Cleaning, repairs, and daily household chores",
    },
  ];

  const features = [
    "Quick task posting and matching",
    "Trusted helpers with ratings",
    "Local community focus",
    "Multiple service categories",
  ];

  // BUTTON HANDLERS ------------------------------

  const handlePostTask = () => {
    router.push("/profiles"); // show available helpers
  };

  const handleBecomeHelper = () => {
    router.push("/register?role=provider");
  };

  const handleNeedHelp = () => {
    router.push("/profiles");
  };

  const handleWantToHelp = () => {
    router.push("/register?role=provider");
  };

  // -------------------------------------------------

  return (
    <div className="overflow-x-hidden pt-10 mt-10">
      {/* 🌟 Hero Section */}
      <section className="bg-linear-to-r from-orange-400 to-red-700 text-white py-20 sm:py-28 rounded-3xl mx-4 mt-6 flex items-center min-h-[70vh]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              On-demand Assistance & Service-Providing Platform
            </h1>
            <p className="text-yellow-300 text-lg mb-8">
              Connecting people with help for their daily tasks
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePostTask}
                className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Post a Task
              </button>

              <button
                onClick={handleBecomeHelper}
                className="border-2 border-white px-6 py-3 rounded-full text-white hover:bg-white hover:text-blue-700 font-semibold transition"
              >
                Become a Helper
              </button>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl text-center"
          >
            🤝
          </motion.div>
        </div>
      </section>

      {/* 💡 About Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            ServeNow - Get Help Anytime, Anywhere
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ServeNow connects people who need help with trusted helpers nearby.
            Post a task, get matched with helpers, and get things done quickly.
          </p>
        </div>
      </section>

      {/* 🧰 Services Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Our Services
          </h2>
          <p className="text-gray-600 mb-10">
            We connect you with helpers for all kinds of tasks
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Why Choose ServeNow?
            </h2>
            <ul className="space-y-4 text-lg text-gray-700">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-gray-300">
            Join thousands of people getting help with their daily tasks
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleNeedHelp}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              I Need Help
            </button>

            <button
              onClick={handleWantToHelp}
              className="border-2 border-white px-6 py-3 rounded-full text-white hover:bg-white hover:text-gray-900 font-semibold transition"
            >
              I Want to Help
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
