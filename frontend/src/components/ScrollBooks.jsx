import React from "react";
import { Link } from "react-router-dom";

const books = [
  {
    id: 1,
    title: "Book Title 1",
    author: "Author A",
    year: 2020,
    description: "A brief summary about Book 1.",
    image:
      "https://th.bing.com/th/id/OIP.YtVZeAaRWQAjKlSQSQsa5gAAAA?rs=1&pid=ImgDetMain",
  },
  {
    id: 2,
    title: "Book Title 2",
    author: "Author B",
    year: 2019,
    description: "A short description of what Book 2 is about.",
    image: "https://www.lalibrairie.com/cache/img/livres/505/9791092272505.jpg",
  },
  {
    id: 3,
    title: "Book Title 3",
    author: "Author C",
    year: 2021,
    description: "Book 3 covers interesting concepts and stories.",
    image:
      "https://th.bing.com/th/id/OIP.sOhRpruk0ypvbhFgWoTy7AHaLG?rs=1&pid=ImgDetMain",
  },
  {
    id: 4,
    title: "Book Title 4",
    author: "Author D",
    year: 2022,
    description: "Explore new adventures in this thrilling read.",
    image:
      "https://th.bing.com/th/id/OIP.sOhRpruk0ypvbhFgWoTy7AHaLG?rs=1&pid=ImgDetMain",
  },
  {
    id: 5,
    title: "Book Title 5",
    author: "Author E",
    year: 2023,
    description: "An insightful look into modern life and society.",
    image:
      "https://th.bing.com/th/id/OIP.sOhRpruk0ypvbhFgWoTy7AHaLG?rs=1&pid=ImgDetMain",
  },
];

const ScrollBooks = () => {
  return (
    <div className="overflow-x-auto whitespace-nowrap px-4 py-6">
      <div className="flex gap-4">
        {books.map((book) => (
          <Link
            to={"/user/book/66cce72866bca8de2c2fd4e4"}
            key={book.id}
            className="min-w-[200px] bg-white rounded-xl shadow-md p-4 text-left"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="mt-2 text-lg font-semibold text-gray-800">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-xs text-gray-400">{book.year}</p>
            <p className="mt-2 text-sm text-gray-700 line-clamp-3">
              {book.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScrollBooks;
