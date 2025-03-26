using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : Controller
    {
        private readonly BookstoreDbContext _context;

        public BooksController(BookstoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks(string? category)
        {
            IQueryable<Book> query = _context.Books;

            // Filter by category if one is selected
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => EF.Functions.Like(b.Category.Trim().ToLower(), category.Trim().ToLower()));
            }

            var books = await query.ToListAsync();
            return Ok(books);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category.Trim())
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }


        [HttpGet("~/Books")]
        public async Task<IActionResult> Index(string? category, int pageSize = 10, int pageNum = 1)
        {
            IQueryable<Book> query = _context.Books;

            // Filter by category if one is selected
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => EF.Functions.Like(b.Category.Trim().ToLower(), category.Trim().ToLower()));

            }

            // Get total number of books (after filtering)
            var totalItems = await query.CountAsync();

            // Calculate total pages
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            // Fetch paginated data
            var books = await query
                .OrderBy(b => b.Title)
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Create a view model for pagination data
            var model = new PaginatedBooksViewModel
            {
                Books = books,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNum,
                PageSize = pageSize,
                CurrentCategory = category
            };

            return View(model);
        }
    }
}
