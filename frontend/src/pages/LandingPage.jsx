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
import { useTranslation, Trans } from "react-i18next";

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
  // const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

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
            <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <div className="text-2xl font-bold text-indigo-600">GrcStack</div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {t("header.features")}
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {t("header.howItWorks")}
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {t("header.faq")}
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              {t("header.login")}
            </a>
            <a
              href="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {t("header.signup")}
            </a>
          </div>

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

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.features")}
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.howItWorks")}
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.faq")}
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <a
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  {t("header.login")}
                </a>
                <a
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  {t("header.signup")}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {t("hero.title")}{" "}
              <span className="text-indigo-200">{t("hero.highlight")}</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/grcstack/grcstack"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
              >
                {t("hero.github")}
              </a>
            </div>
            <div className="mt-8 text-indigo-200 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{t("hero.openSource")}</span>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="flex flex-row justify-center items-center bg-white p-6 rounded-xl shadow-2xl transform rotate-2 transition-transform hover:rotate-0">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-sm font-semibold text-black ml-2">
                  {t("hero.manageCompliance")}
                </h1>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-semibold">
                  {t("hero.aiMapping")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("howItWorksSection.title")}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t("howItWorksSection.description")}
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
                  {t("howItWorksSection.steps.step1.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorksSection.steps.step1.desc")}
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
                <h3 className="text-xl font-semibold mb-3">
                  {t("howItWorksSection.steps.step2.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorksSection.steps.step2.desc")}
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
                <h3 className="text-xl font-semibold mb-3">
                  {t("howItWorksSection.steps.step3.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorksSection.steps.step3.desc")}
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
                <h3 className="text-xl font-semibold mb-3">
                  {t("howItWorksSection.steps.step4.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorksSection.steps.step4.desc")}
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
              {t("howItWorksSection.githubButton")}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("faqSection.title")}
            </h2>
            <p className="text-lg text-gray-700">
              {t("faqSection.description")}
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
                    {t(`faqSection.items.${index}.question`)}
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
                    {t(`faqSection.items.${index}.answer`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">
              {t("faqSection.stillHaveQuestions")}
            </p>
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
              {t("faqSection.joinDiscussion")}
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/grcstack/grcstack"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg"
              aria-label={t("cta.starOnGithub")}
            >
              {t("cta.starOnGithub")}
            </a>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition"
              aria-label={t("cta.scheduleDemo")}
            >
              {t("cta.scheduleDemo")}
            </button>
          </div>
          <p className="mt-6 text-sm text-indigo-200">{t("cta.freeForever")}</p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {t("newsletter.title")}
              </h2>
              <p className="text-gray-600">{t("newsletter.description")}</p>
            </div>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder={t("newsletter.emailPlaceholder")}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                aria-label={t("newsletter.emailLabel")}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {t("newsletter.subscribe")}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              {t("newsletter.privacyNotice")}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">{t("footer.brand")}</div>
              <p className="text-gray-400 mb-4">{t("footer.description")}</p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/sarabentafat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label={t("footer.githubLabel")}
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com/sarabentafat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label={t("footer.twitterLabel")}
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775a4.932 4.932 0 002.163-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 00-8.373 4.482A13.933 13.933 0 011.671 3.149a4.916 4.916 0 001.523 6.574c-.806-.026-1.566-.248-2.228-.616v.06a4.915 4.915 0 003.946 4.816c-.398.108-.816.166-1.247.166-.304 0-.6-.029-.889-.086a4.918 4.918 0 004.588 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068a13.94 13.94 0 007.557 2.212c9.054 0 14.004-7.496 14.004-13.986 0-.213-.005-.425-.014-.637A9.936 9.936 0 0024 4.59z" />
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/in/sarabentafat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label={t("footer.linkedinLabel")}
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.783 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.378-1.122-2.5-2.5-2.5s-2.5 1.122-2.5 2.5v5.5h-3v-10h3v1.357c.67-1.125 2.342-1.357 3.5-1.357 2.206 0 4 1.794 4 4v5.643z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">
                {t("footer.linksTitle")}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/docs" className="hover:text-white">
                    {t("footer.docs")}
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white">
                    {t("footer.about")}
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">
                {t("footer.resourcesTitle")}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/blog" className="hover:text-white">
                    {t("footer.blog")}
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white">
                    {t("footer.faq")}
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white">
                    {t("footer.support")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">
                {t("footer.subscribeTitle")}
              </h3>
              <form
                className="flex flex-col space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={t("footer.subscribePlaceholder")}
                  className="px-4 py-3 rounded-lg text-gray-900"
                  aria-label={t("footer.subscribeLabel")}
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  {t("footer.subscribeButton")}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {t("footer.brand")}.{" "}
            {t("footer.rightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
