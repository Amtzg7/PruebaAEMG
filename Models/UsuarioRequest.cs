using System.ComponentModel.DataAnnotations;

namespace SGUDaltumAPI.Models
{
    public class UsuarioRequest
    {
        [Required]
        public string Nombre { get; set; }

        [Required]
        [EmailAddress]
        public string Correo { get; set; }

        [Required]
        public string Contrasena { get; set; }
    }
}
