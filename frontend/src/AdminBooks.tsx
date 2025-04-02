import React, { useState, useEffect } from "react";

// Type for Book, you can customize it based on your Book model
interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  price: number;
}

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    category: "",
    price: 0,
  });

  // Fetch the books from the backend API
  const fetchBooks = async () => {
    const response = await fetch("/api/books");
    const data = await response.json();
    setBooks(data);
  };

  // Handle adding a new book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (response.ok) {
      alert("Book added!");
      setNewBook({
        id: 0,
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        category: "",
        price: 0,
      });
      fetchBooks(); // Refresh the list of books
    } else {
      alert("Failed to add book.");
    }
  };

  // Handle editing an existing book
  const handleEditBook = async (editedBook: Book) => {
    const response = await fetch(`/api/books/${editedBook.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedBook),
    });

    if (response.ok) {
      alert("Book updated!");
      fetchBooks(); // Refresh the list of books
    } else {
      alert("Failed to update book.");
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (bookId: number) => {
    const response = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Book deleted!");
      fetchBooks(); // Refresh the list of books
    } else {
      alert("Failed to delete book.");
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Admin Book Management</h1>
      <p>Here you can manage the books in your store.</p>

      {/* Form to add a new book */}
      <h2>Add New Book</h2>
      <form onSubmit={handleAddBook}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
        </div>
        <div>
          <label>Publisher</label>
          <input
            type="text"
            value={newBook.publisher}
            onChange={(e) =>
              setNewBook({ ...newBook, publisher: e.target.value })
            }
          />
        </div>
        <div>
          <label>ISBN</label>
          <input
            type="text"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={newBook.category}
            onChange={(e) =>
              setNewBook({ ...newBook, category: e.target.value })
            }
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={newBook.price}
            onChange={(e) =>
              setNewBook({ ...newBook, price: parseFloat(e.target.value) })
            }
          />
        </div>
        <button type="submit">Add Book</button>
      </form>

      {/* Display books list */}
      <h2>Existing Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.publisher}</p>
            <p>{book.category}</p>
            <p>${book.price}</p>
            <button onClick={() => handleEditBook(book)}>Edit</button>
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBooks;
