"use client";
import { X, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const RecommendationPanel = ({ level, onClose }) => {
  // Mock recommendations based on control ID
  const getRecommendations = (level) => {
    const id = level.identifier || "";

    if (id.includes("1")) {
      return {
        title: "Network Security Recommendations",
        description: "Recommendations for improving network security controls",
        items: [
          "Implement network segmentation to isolate cardholder data environment",
          "Document firewall configurations and review quarterly",
          "Restrict inbound and outbound traffic to only necessary protocols",
          "Implement intrusion detection and prevention systems",
        ],
        riskLevel: "high",
      };
    } else if (id.includes("2")) {
      return {
        title: "Authentication & Access Control Recommendations",
        description:
          "Recommendations for improving authentication and access controls",
        items: [
          "Implement strong password policies with minimum 12 characters",
          "Enable multi-factor authentication for all remote access",
          "Remove default vendor accounts and passwords",
          "Implement role-based access control",
        ],
        riskLevel: "medium",
      };
    } else if (id.includes("3")) {
      return {
        title: "Data Protection Recommendations",
        description: "Recommendations for protecting sensitive data",
        items: [
          "Encrypt transmission of cardholder data across open, public networks",
          "Use strong cryptography and security protocols",
          "Implement key management procedures",
          "Maintain an inventory of system components that store sensitive data",
        ],
        riskLevel: "high",
      };
    } else {
      return {
        title: "General Security Recommendations",
        description: "General recommendations for improving security controls",
        items: [
          "Implement security controls according to industry best practices",
          "Maintain documentation of compliance",
          "Conduct regular security awareness training",
          "Perform regular vulnerability scanning and penetration testing",
        ],
        riskLevel: "medium",
      };
    }
  };

  const recommendations = getRecommendations(level);

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return (
          <div className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-300 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <AlertTriangle className="h-3 w-3" />
            High Risk
          </div>
        );
      case "medium":
        return (
          <div className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-1 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            <Info className="h-3 w-3" />
            Medium Risk
          </div>
        );
      case "low":
        return (
          <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            <Info className="h-3 w-3" />
            Low Risk
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Recommendations</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {level.identifier}: {level.title}
              </h3>
              {getRiskBadge(recommendations.riskLevel)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recommendations.description}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Control Description
            </h4>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {level.content !== "No content provided"
                ? level.content
                : "No detailed description available for this control."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recommended Actions
            </h4>
            <div className="space-y-3">
              {recommendations.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Implementation Guidance
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Implement these recommendations according to your
                  organization's risk assessment and compliance requirements.
                  Document all changes and maintain evidence of implementation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPanel;
