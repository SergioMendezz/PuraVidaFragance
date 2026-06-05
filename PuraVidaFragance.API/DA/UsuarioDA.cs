using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class UsuarioDA : IUsuarioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public UsuarioDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<UsuarioResponse?> ObtenerPorEmail(string email)
        {
            return await _sqlConnection.QueryFirstOrDefaultAsync<UsuarioResponse>(
                "ObtenerUsuarioPorEmail",
                new { Email = email },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task ActualizarUltimoAcceso(Guid id)
        {
            await _sqlConnection.ExecuteAsync(
                "ActualizarUltimoAcceso",
                new { Id = id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task GuardarTokenRevocado(string token, Guid usuarioId, DateTime expira)
        {
            await _sqlConnection.ExecuteAsync(
                "GuardarTokenRevocado",
                new
                {
                    Id = Guid.NewGuid(),
                    Token = token,
                    UsuarioId = usuarioId,
                    FechaExpiracion = expira
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<bool> TokenEstaRevocado(string token)
        {
            var resultado = await _sqlConnection.ExecuteScalarAsync<int>(
                "TokenEstaRevocado",
                new { Token = token },
                commandType: System.Data.CommandType.StoredProcedure);
            return resultado > 0;
        }
        #endregion
    }
}