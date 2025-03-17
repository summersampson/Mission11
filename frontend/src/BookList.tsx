import React, { useEffect, useState } from "react";

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  price: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    fetch("http://localhost:5077/api/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch book data");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setSortedBooks(data); // Default sorted state
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        alert("Failed to load book data. Please check the server connection.");
      });
  }, []);

  // Sorting Logic
  const sortBooks = () => {
    const sorted = [...sortedBooks].sort(
      (a, b) =>
        isSortedAsc
          ? a.title.localeCompare(b.title) // A → Z
          : b.title.localeCompare(a.title) // Z → A
    );

    setSortedBooks(sorted);
    setIsSortedAsc(!isSortedAsc); // Toggle sort order
  };

  // Pagination Logic
  const totalPages = Math.ceil(sortedBooks.length / pageSize);

  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Page Navigation Handlers
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">📚 Book List</h1>

      {/* Sort Button */}
      <button className="btn btn-primary mb-3" onClick={sortBooks}>
        Sort by Title {isSortedAsc ? "(A → Z)" : "(Z → A)"}
      </button>

      {/* Results Per Page Selector */}
      <label className="ms-3">
        Results per page:
        <select
          className="form-select d-inline-block w-auto ms-2"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1); // Reset to page 1 when changing page size
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>

      {/* Book List */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {paginatedBooks.map((book) => (
          <div key={book.bookID} className="col">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title text-primary">{book.title}</h5>
                <p className="card-text">
                  <strong>Author:</strong> {book.author} <br />
                  <strong>Publisher:</strong> {book.publisher} <br />
                  <strong>Price:</strong> ${book.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-primary me-2"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary ms-2"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
