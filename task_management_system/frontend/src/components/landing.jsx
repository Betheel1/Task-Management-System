import React from "react";

const LandingPage = () => {
  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div className="text-lg font-semibold">Vintage Technologies PLC</div>
        <ul className="flex space-x-6">
          <li>
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-gray-300">
              Services
            </a>
          </li>
          <li>
            <a href="#portfolio" className="hover:text-gray-300">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to Vintage Technologies Task Management System
        </h1>
        <p className="text-xl mb-6 max-w-2xl">
          An innovative and efficient task management system designed by Vintage
          Technologies PLC. Organize, track, and complete your tasks seamlessly
          with our powerful software.
        </p>
        <a href="/login">
          <button className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
            Get Started
          </button>
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">About Us</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Vintage Technologies PLC is one of the top-rated software
            development companies in Ethiopia. With a vision of quality and
            innovation, we have been successful in catering to the needs of
            clients in various IT-enabled services, including Software
            Solutions, Web Solutions, Graphic & Multimedia Solutions, Quality
            Assurance & Testing, Application Maintenance & Support, Turnkey
            Solutions, and Offshore Development.{" "}
            <a
              href="https://vintechplc.com/company/about"
              className="text-blue-600 hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Application Development
              </h3>
              <p className="text-gray-600">
                Providing unbeatable solutions using the latest technologies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Graphics and Multimedia Solutions
              </h3>
              <p className="text-gray-600">
                Crafting visually appealing designs and multimedia content.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Application Maintenance & Support
              </h3>
              <p className="text-gray-600">
                Ensuring your applications run smoothly with our support
                services.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Consultancy</h3>
              <p className="text-gray-600">
                Offering expert advice to optimize your business processes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Education & Training</h3>
              <p className="text-gray-600">
                Empowering your team with the knowledge they need to succeed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Call Center Configuration & VAS
              </h3>
              <p className="text-gray-600">
                Setting up efficient call centers and value-added services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Portfolio</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Presenting our recent projects that showcase our commitment to
            quality and innovation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Emebet - Job Matching Platform
              </h3>
              <p className="text-gray-600">
                An app that simplifies job hunting for female job seekers,
                including both low-literate individuals and those with academic
                backgrounds seeking part-time and full-time employment.{" "}
                <a
                  href="https://vintechplc.com/work/337/Emebet%20-%20Job%20Matching%20Platform"
                  className="text-blue-600 hover:underline"
                >
                  View project
                </a>
              </p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Maraki: Ethiopian Dating App
              </h3>
              <p className="text-gray-600">
                An innovative dating app designed to revolutionize the way
                Ethiopians find love and meaningful connections.{" "}
                <a
                  href="https://vintechplc.com/work/340/Zoe%20Store%20Mobile%20App"
                  className="text-blue-600 hover:underline"
                >
                  View project
                </a>
              </p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Zoe Store Mobile App</h3>
              <p className="text-gray-600">
                A modern e-commerce platform designed for seamless online
                shopping experiences in Ethiopia.
                <a
                  href="https://vintechplc.com/work/340/Zoe%20Store%20Mobile%20App"
                  className="text-blue-600 hover:underline"
                >
                  {" "}
                  View project
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Contact Us</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Reach out to us for any inquiries, collaborations, or business
            opportunities.
          </p>
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">
              📍 Location: Addis Ababa, Ethiopia
            </p>
            <p className="text-lg font-semibold">📞 Phone: +251 9XX-XXX-XXX</p>
            <p className="text-lg font-semibold">
              📧 Email:{" "}
              <a
                href="mailto:info@vintechplc.com"
                className="text-blue-600 hover:underline"
              >
                info@vintechplc.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-600 text-white text-center">
        <p>
          © {new Date().getFullYear()} Vintage Technologies PLC. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
