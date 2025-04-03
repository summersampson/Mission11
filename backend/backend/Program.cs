using Microsoft.EntityFrameworkCore;
using backend.Models; // Import your model's namespace

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    // Disable HTTPS redirection for local development
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseRouting();

// Add CORS Middleware
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

