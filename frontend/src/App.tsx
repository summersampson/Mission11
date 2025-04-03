import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookList from "./BookList";
import Cart from "./Cart";
import AdminBooks from "./AdminBooks"; // Import AdminBooks component
import { CartProvider } from "./CartContext";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Bookstore
            </Link>
            <div className="d-flex">
              <Link className="btn btn-outline-primary me-2" to="/">
                Home
              </Link>
              <Link className="btn btn-outline-success" to="/cart">
                Cart
              </Link>
              <Link className="btn btn-outline-danger ms-2" to="/adminbooks">
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/adminbooks" element={<AdminBooks />} />{" "}
          {/* Add AdminBooks route */}
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
