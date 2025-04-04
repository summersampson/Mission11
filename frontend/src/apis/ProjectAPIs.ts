const API_BASE =
  "https://summerbackend-e9c4a0g9gnhtfde2.eastus-01.azurewebsites.net/api";

export const getBooks = async () => {
  const res = await fetch(`${API_BASE}/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

export const addBook = async (book: any) => {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
};

export const updateBook = async (id: number, book: any) => {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const deleteBook = async (id: number) => {
  const res = await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
};
