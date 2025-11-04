using ChatApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Add SignalR
builder.Services.AddSignalR();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS
app.UseCors("AllowReactApp");

// Map SignalR hub
app.MapHub<ChatHub>("/chatHub");

// Health check endpoint
app.MapGet("/", () => Results.Ok(new { 
    status = "running", 
    message = "Chat API with SignalR is running",
    hubEndpoint = "/chatHub"
}))
.WithName("HealthCheck");

app.Run();
