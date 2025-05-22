"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  ChevronDown,
  Menu,
  X,
  Shield,
  BarChart3,
  FileCheck,
  Quote,
} from "lucide-react";

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Compliance Director, FinTech Inc.",
    content:
      "GrcStack reduced our audit preparation time by 65%. The AI-powered mapping between frameworks saved us countless hours of manual work.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CISO, Healthcare Solutions",
    content:
      "Managing multiple compliance frameworks used to be a nightmare. With GrcStack, we can easily see overlaps and address requirements efficiently.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Risk Manager, Enterprise Corp",
    content:
      "The visualization tools and automated reporting have transformed how we communicate compliance status to our board and executives.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
];

// FAQ items
const faqItems = [
  {
    question: "How does the AI mapping technology work?",
    answer:
      "Our proprietary AI engine analyzes the semantic meaning and requirements across different compliance frameworks, automatically identifying overlaps and relationships between controls. This reduces manual mapping efforts by up to 80%.",
  },
  {
    question: "Can GrcStack integrate with our existing tools?",
    answer:
      "Yes, GrcStack offers API integrations with popular GRC tools, ticketing systems, and documentation platforms. Our open source version includes integration support with documentation on how to extend functionality.",
  },
  {
    question: "How long does implementation typically take?",
    answer:
      "Most users are up and running within 2-4 weeks. Our self-hosted version can be implemented in days, while enterprise implementations may take longer depending on customization needs.",
  },
  {
    question: "Which compliance frameworks do you support?",
    answer:
      "We support all major frameworks including ISO 27001, NIST CSF, PCI DSS, HIPAA, SOC 2, GDPR, and many more. New frameworks are added regularly based on community contributions.",
  },
];

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header/Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">GrcStack</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <a
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Simplify Your <span className="text-indigo-200">Compliance</span>{" "}
              Journey
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
              GrcStack helps you manage Governance, Risk, and Compliance with
              AI-powered mapping, automated audits, and clear visualizations—all
              in one powerful open-source platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/grcstack/grcstack"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
              >
                GitHub Repository
              </a>
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition transform hover:-translate-y-1">
                Watch Demo
              </button>
            </div>
            <div className="mt-8 text-indigo-200 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>100% Open Source</span>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-2xl transform rotate-2 transition-transform hover:rotate-0">
                <img
                  src="/placeholder.svg?height=400&width=500&text=GrcStack+Dashboard"
                  alt="GrcStack Dashboard Preview"
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-semibold">
                  AI-Powered Mapping
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-8">
            Trusted by compliance teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
              >
                <img
                  src={`/placeholder.svg?height=40&width=120&text=Company${i}`}
                  alt={`Company ${i}`}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Compliance
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              GrcStack combines powerful technology with intuitive design to
              transform how you manage compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Mapping</h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI automatically identifies relationships between
                different compliance frameworks, saving you hours of manual
                work.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Cross-framework mapping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>80% reduction in mapping time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Continuous updates for new standards</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center"
              >
                Learn more
                <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
              </a>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Dashboards</h3>
              <p className="text-gray-600 mb-4">
                Intuitive visualizations help you understand your compliance
                posture at a glance and identify gaps quickly.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Real-time compliance status</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Customizable risk heat maps</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Executive-ready reports</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center"
              >
                Learn more
                <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <FileCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Audits</h3>
              <p className="text-gray-600 mb-4">
                Streamline your audit process with automated evidence
                collection, testing, and reporting.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Automated evidence collection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Continuous compliance monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Audit-ready documentation</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center"
              >
                Learn more
                <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How GrcStack Works
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform simplifies compliance management in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition h-full">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Import Frameworks
                </h3>
                <p className="text-gray-600">
                  Choose from our library of pre-loaded compliance frameworks or
                  import your custom requirements.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 left-full w-16 h-1 bg-indigo-200 -translate-y-1/2 transform -translate-x-8">
                <div className="absolute right-0 top-1/2 w-3 h-3 bg-indigo-400 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition h-full">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Mapping</h3>
                <p className="text-gray-600">
                  Our AI automatically maps controls between frameworks,
                  identifying overlaps and relationships.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 left-full w-16 h-1 bg-indigo-200 -translate-y-1/2 transform -translate-x-8">
                <div className="absolute right-0 top-1/2 w-3 h-3 bg-indigo-400 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition h-full">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Assess & Monitor</h3>
                <p className="text-gray-600">
                  Track compliance status, collect evidence, and monitor changes
                  with automated assessments.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 left-full w-16 h-1 bg-indigo-200 -translate-y-1/2 transform -translate-x-8">
                <div className="absolute right-0 top-1/2 w-3 h-3 bg-indigo-400 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition h-full">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3">Report & Improve</h3>
                <p className="text-gray-600">
                  Generate audit-ready reports and get actionable insights to
                  improve your compliance posture.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="https://github.com/grcstack/grcstack"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join hundreds of compliance professionals who trust GrcStack.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-indigo-600">
                <Quote className="h-12 w-12" />
              </div>

              <div className="mt-6">
                <div className="relative overflow-hidden h-32">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`absolute w-full transition-opacity duration-500 ${
                        index === activeTestimonial
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <p className="text-gray-700 text-lg italic mb-6">
                        "{testimonial.content}"
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center">
                  <img
                    src={
                      testimonials[activeTestimonial].avatar ||
                      "/placeholder.svg"
                    }
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === activeTestimonial
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      activeFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="p-4 pt-0 text-gray-600 bg-white">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Still have questions?</p>
            <a
              href="https://github.com/grcstack/grcstack/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Join the Discussion
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Compliance Process?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations that trust GrcStack to simplify their
            compliance journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/grcstack/grcstack"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Star on GitHub
            </a>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition">
              Schedule Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-indigo-200">
            100% open source. Free forever.
          </p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with GRC Insights
              </h2>
              <p className="text-gray-600">
                Subscribe to our newsletter for compliance tips, industry
                updates, and GrcStack news.
              </p>
            </div>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">GrcStack</div>
              <p className="text-gray-400 mb-4">
                Simplifying compliance management with open-source AI-powered
                solutions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/grcstack/grcstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contributors
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GrcStack. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
