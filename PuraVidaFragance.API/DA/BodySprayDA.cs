using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class BodySprayDA : IBodySprayDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public BodySprayDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<BodySprayResponse>> Obtener()
        {
            return await _sqlConnection.QueryAsync<BodySprayResponse>(
                "ObtenerBodySprays",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<BodySprayResponse> Obtener(Guid Id)
        {
            return await _sqlConnection.QueryFirstOrDefaultAsync<BodySprayResponse>(
                "ObtenerBodySpray",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Agregar(BodySprayRequest bodySpray)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarBodySpray",
                new
                {
                    Id = Guid.NewGuid(),
                    bodySpray.Nombre,
                    bodySpray.IdPerfumeBase,
                    bodySpray.Mililitros,
                    bodySpray.Precio,
                    bodySpray.Descripcion,
                    bodySpray.ImagenUrl,
                    bodySpray.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Editar(Guid Id, BodySprayRequest bodySpray)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarBodySpray",
                new
                {
                    Id,
                    bodySpray.Nombre,
                    bodySpray.IdPerfumeBase,
                    bodySpray.Mililitros,
                    bodySpray.Precio,
                    bodySpray.Descripcion,
                    bodySpray.ImagenUrl,
                    bodySpray.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarBodySpray",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Activar(Guid Id)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "ActivarBodySpray",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid Id)
        {
            var bodySpray = await Obtener(Id);
            if (bodySpray == null)
                throw new Exception("No se encontró el body spray");
        }
        #endregion
    }
}