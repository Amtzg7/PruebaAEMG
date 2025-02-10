using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGUDaltumAPI.Data;
using SGUDaltumAPI.Models;
using SGUDaltumAPI.Services;

namespace SGUDaltumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly SGUDbContext _context;

        public UsuariosController(AuthService authService, SGUDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Models.LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Correo) || string.IsNullOrWhiteSpace(request.Contrasena))
                return BadRequest(new { mensaje = "Correo y contraseña son obligatorios." });

            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo.ToLower() == request.Correo.ToLower());
            if (user == null || user.Contrasena != _authService.EncriptarSHA256(request.Contrasena))
                return Unauthorized(new { mensaje = "Credenciales incorrectas." });

            var token = _authService.generarJWT(user);
            return Ok(new { mensaje = "Inicio de sesión correcto.", token });
        }

        [HttpPost("Registrarse")]
        public async Task<IActionResult> Registrarse([FromBody] UsuarioRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Correo) || string.IsNullOrWhiteSpace(request.Contrasena))
                return BadRequest(new { mensaje = "Nombre, Correo y contraseña son obligatorios." });

            var existeUsuario = await _context.Usuarios
                .AnyAsync(u => u.Correo.ToLower() == request.Correo.ToLower());
            if (existeUsuario)
                return Conflict(new { mensaje = "El correo ya está registrado." });

            var nuevoUsuario = new Usuario
            {
                Nombre = request.Nombre,
                Correo = request.Correo,
                Contrasena = _authService.EncriptarSHA256(request.Contrasena)
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente." });
        }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult>Lista(int page = 1, int pageSize = 10)
        {
            var usuarios = await _context.Usuarios
                .Select(u => new { u.Id, u.Nombre, u.Correo })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(usuarios);
        }
        [HttpGet]
        [Route("ValidarToken")]
        public IActionResult ValidarToken([FromQuery] string token)
        {
            bool respuesta = _authService.ValidateToken(token);
            return StatusCode(StatusCodes.Status200OK, new { respuesta });
        }
    }
}
