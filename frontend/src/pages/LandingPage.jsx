import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to GrcStack
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          The smart way to manage Governance, Risk, and Compliance. Visualize,
          map, and audit your standards—all in one powerful platform.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
            Get Started
          </button>
          <Link to={'/login'} className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition">
            Login
          </Link>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ✨ AI-Powered Mapping
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Use our advanced AI engine to automatically identify correspondences
          between standards like SWIFT CSCF and PCI DSS. No more manual
          mapping—save time, reduce errors, and focus on what matters.
        </p>
      </section>

      {/* Why GrcStack Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why GrcStack?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Automated Audits</h3>
            <p className="text-gray-700">
              Quickly generate reports and audit results using automation and
              custom criteria.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Cross-Framework Mapping
            </h3>
            <p className="text-gray-700">
              Visualize and compare controls between multiple compliance
              standards with ease.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Clear & Actionable</h3>
            <p className="text-gray-700">
              Get clear insights and corrective action suggestions in just a few
              clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} GrcStack. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
