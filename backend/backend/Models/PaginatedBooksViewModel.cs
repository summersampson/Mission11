using System.Collections.Generic;

namespace backend.Models
{
    public class PaginatedBooksViewModel
    {
        public IEnumerable<Book> ? Books { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }

        public string? CurrentCategory { get; set; }
    }
}
