import React, { useEffect, useState } from "react";

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [classification, setClassification] = useState("");
  const [category, setCategory] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched books:", data);
        setBooks(data);
      })
      .catch((err) => console.error("Failed to load books:", err));
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPublisher("");
    setIsbn("");
    setClassification("");
    setCategory("");
    setPageCount("");
    setPrice("");
    setEditingId(null);
  };

  const handleAddBook = () => {
    const newBook = {
      title,
      author,
      publisher,
      isbn,
      classification,
      category,
      pageCount: parseInt(pageCount),
      price: parseFloat(price),
    };

    fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add book");
        return res.json();
      })
      .then((addedBook) => {
        setBooks([...books, addedBook]);
        resetForm();
      })
      .catch((err) => console.error("Add error:", err));
  };

  const handleUpdateBook = () => {
    if (editingId === null) return;

    const updatedBook = {
      bookID: editingId,
      title,
      author,
      publisher,
      isbn,
      classification,
      category,
      pageCount: parseInt(pageCount),
      price: parseFloat(price),
    };

    fetch(`/api/books/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(books.map((b) => (b.bookID === editingId ? data : b)));
        resetForm();
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDelete = (id: number) => {
    fetch(`/api/books/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        setBooks(books.filter((b) => b.bookID !== id));
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handleEdit = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setPublisher(book.publisher);
    setIsbn(book.isbn);
    setClassification(book.classification);
    setCategory(book.category);
    setPageCount(book.pageCount.toString());
    setPrice(book.price.toString());
    setEditingId(book.bookID);
  };

  return (
    <div className="container">
      <h2>Admin Book Management</h2>
      <p>Here you can manage the books in your store.</p>

      <h4>{editingId ? "Edit Book" : "Add New Book"}</h4>
      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Classification"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Page Count"
          value={pageCount}
          onChange={(e) => setPageCount(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {editingId ? (
          <button className="btn btn-primary me-2" onClick={handleUpdateBook}>
            Update Book
          </button>
        ) : (
          <button className="btn btn-primary me-2" onClick={handleAddBook}>
            Add Book
          </button>
        )}
        {editingId && (
          <button className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <h4>Existing Books</h4>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBooks;
