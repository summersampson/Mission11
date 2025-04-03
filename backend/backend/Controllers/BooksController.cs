using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

public class BooksController : Controller
{
    private readonly BookstoreDbContext _context;

    public BooksController(BookstoreDbContext context)
    {
        _context = context;
    }

    // For the Index page, which is used by your React app
    [HttpGet("api/books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        var books = await _context.Books.ToListAsync();
        return Ok(books);
    }

        // POST: api/books
    [HttpPost("api/books")]
    public async Task<IActionResult> AddBook([FromBody] Book newBook)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Books.Add(newBook);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooks), new { id = newBook.BookID }, newBook);
    }

    // PUT: api/books/{id}
    [HttpPut("api/books/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
    {
        if (id != updatedBook.BookID)
        {
            return BadRequest("Book ID mismatch.");
        }

        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        book.Title = updatedBook.Title;
        book.Author = updatedBook.Author;
        book.Publisher = updatedBook.Publisher;
        book.ISBN = updatedBook.ISBN;
        book.Category = updatedBook.Category;
        book.Price = updatedBook.Price;

        await _context.SaveChangesAsync();
        return Ok(book);
    }

    // DELETE: api/books/{id}
    [HttpDelete("api/books/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }


    // MVC action to show books in a view with pagination
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks(int pageNum = 1, int pageSize = 5, string? category = null)
    {
        // Apply category filter if any
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Get the total number of books in the filtered list
        var totalItems = await query.CountAsync();

        // Get the books for the current page
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Create the PaginatedBooksViewModel
        var model = new PaginatedBooksViewModel
        {
            Books = books,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            CurrentPage = pageNum,
            PageSize = pageSize,
            CurrentCategory = category
        };

        return View(model);
    }

    // Create methods (used for forms in MVC)
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Title, Author, Publisher, ISBN, Category, Price")] Book book)
    {
        if (ModelState.IsValid)
        {
            _context.Add(book);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(book);
    }

    // Edit methods
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }
        return View(book);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("BookID, Title, Author, Publisher, ISBN, Category, Price")] Book book)
    {
        if (id != book.BookID)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(book);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(book.BookID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(book);
    }

    // Delete methods
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var book = await _context.Books
            .FirstOrDefaultAsync(m => m.BookID == id);
        if (book == null)
        {
            return NotFound();
        }

        return View(book);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool BookExists(int id)
    {
        return _context.Books.Any(e => e.BookID == id);
    }
}
