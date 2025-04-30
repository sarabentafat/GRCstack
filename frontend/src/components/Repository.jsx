import React from "react";
import NavBar from "../sections/NavBar";

const Repository = () => {
  const resources = [
    {
      field: "Médecine",
      years: [
        {
          year: "Première Année",
          links: [
            {
              title: "1er anne faculte constantine",
              url: "https://drive.google.com/drive/u/0/folders/1fyMlax86y_HPfAGCyAi5-R1x9P64xNtS",
            },
            {
              title: "M23 constantine",
              url: "https://drive.google.com/drive/folders/1bSxdd6zVEZSuIzV1H2-oUxZ7JI9tt6n6",
            },
          ],
        },
        {
          year: "Deuxième Année",
          links: [
            {
              title: "Notes de Pharmacologie",
              url: "https://drive.google.com/link3",
            },
            {
              title: "Diapositives de Pathologie",
              url: "https://drive.google.com/link4",
            },
          ],
        },
        {
          year: "Troisième Année",
          links: [
            {
              title: "Notes de Chirurgie",
              url: "https://drive.google.com/link5",
            },
            {
              title: "Diapositives de Médecine Interne",
              url: "https://drive.google.com/link6",
            },
          ],
        },
        {
          year: "Quatrième Année",
          links: [
            {
              title: "Notes de Pédiatrie",
              url: "https://drive.google.com/link7",
            },
            {
              title: "Diapositives de Gynécologie",
              url: "https://drive.google.com/link8",
            },
          ],
        },
        {
          year: "Cinquième Année",
          links: [
            {
              title: "Notes de Médecine Générale",
              url: "https://drive.google.com/link9",
            },
            {
              title: "Diapositives de Médecine d'Urgence",
              url: "https://drive.google.com/link10",
            },
          ],
        },
      ],
    },
    {
      field: "Pharmacie",
      years: [
        {
          year: "Première Année",
          links: [
            {
              title: "Notes de Chimie Organique",
              url: "https://drive.google.com/link11",
            },
            {
              title: "Diapositives de Biopharmacie",
              url: "https://drive.google.com/link12",
            },
          ],
        },
        {
          year: "Deuxième Année",
          links: [
            {
              title: "Notes de Pharmacie Clinique",
              url: "https://drive.google.com/link13",
            },
            {
              title: "Diapositives de Pharmacognosie",
              url: "https://drive.google.com/link14",
            },
          ],
        },
        {
          year: "Troisième Année",
          links: [
            {
              title: "Notes de Pharmacologie Avancée",
              url: "https://drive.google.com/link15",
            },
            {
              title: "Diapositives de Toxicologie",
              url: "https://drive.google.com/link16",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="container mx-auto ">
        {" "}
        <NavBar />
      </div>

      <div className="bg-blue-50 ">
        {" "}
        <div className="container mx-auto p-6 ">
          {resources.map((resource) => (
            <div key={resource.field} className="mb-8">
              <h2 className="text-3xl font-bold  text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
                {resource.field}
              </h2>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {resource.years.map((year) => (
                  <div
                    key={year.year}
                    className="bg-white rounded-lg shadow p-4 transition-transform transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {year.year}
                    </h3>
                    <ul className="space-y-2">
                      {year.links.map((link) => (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out"
                            aria-label={`Lien vers ${link.title}`}
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Repository;
