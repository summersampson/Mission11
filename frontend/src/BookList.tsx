import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  price: number;
  category: string; // Add category to match database
}

const BookList: React.FC = () => {
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);
  const [showToast, setShowToast] = useState(false);
  const { cartItems } = useCart();

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Default = All

  useEffect(() => {
    const fetchBooks = () => {
      const url = selectedCategory
        ? `http://localhost:5077/api/books?category=${encodeURIComponent(
            selectedCategory
          )}`
        : "http://localhost:5077/api/books";

      // Load categories
      // Load categories
      fetch("http://localhost:5077/api/books/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Failed to load categories", err));

      fetch(url)
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
          alert(
            "Failed to load book data. Please check the server connection."
          );
        });
    };

    fetchBooks();
  }, [selectedCategory]); // Ensure selectedCategory is a dependency

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
      {showToast && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          ✅ Book added to cart!
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="alert alert-info">
          🛒 You have {cartItems.length} item{cartItems.length > 1 && "s"} in
          your cart. Total: ${cartTotal.toFixed(2)}
        </div>
      )}

      <div className="mb-3">
        <label className="me-2">Filter by Category:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

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
                <h5 className="card-title text-primary">
                  {book.title}{" "}
                  <span className="badge bg-warning text-dark">New!</span>
                </h5>

                <p className="card-text">
                  <strong>Author:</strong> {book.author} <br />
                  <strong>Publisher:</strong> {book.publisher} <br />
                  <strong>Price:</strong> ${book.price.toFixed(2)}
                  <br />
                  <strong>Category:</strong> {book.category}
                </p>
                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={() => {
                    addToCart({ ...book, quantity: 1 });
                    setShowToast(true);

                    // ✅ Store shopping state in localStorage
                    localStorage.setItem(
                      "continueShoppingState",
                      JSON.stringify({
                        page: currentPage,
                        size: pageSize,
                        category: selectedCategory,
                      })
                    );
                  }}
                >
                  Add to Cart
                </button>
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
