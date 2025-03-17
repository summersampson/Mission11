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

        // API endpoint for React
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        public async Task<IActionResult> Index(int pageSize = 10, int pageNum = 1)
        {
            var totalItems = await _context.Books.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var books = await _context.Books
                .OrderBy(b => b.Title)
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var model = new PaginatedBooksViewModel
            {
                Books = books,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNum,
                PageSize = pageSize
            };

            return View(model);
        }
    }
}
