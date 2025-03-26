import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookList from "./BookList";
import Cart from "./Cart";
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
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
