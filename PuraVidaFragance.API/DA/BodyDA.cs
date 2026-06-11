using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class BodyDA : IBodyDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public BodyDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<BodyResponse>> Obtener()
        {
            return await _sqlConnection.QueryAsync<BodyResponse>(
                "ObtenerBodys",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<BodyResponse> Obtener(Guid Id)
        {
            return await _sqlConnection.QueryFirstOrDefaultAsync<BodyResponse>(
                "ObtenerBody",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Agregar(BodyRequest body)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarBody",
                new
                {
                    Id = Guid.NewGuid(),
                    body.Nombre,
                    body.Mililitros,
                    body.Precio,
                    body.Descripcion,
                    body.ImagenUrl,
                    body.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Editar(Guid Id, BodyRequest body)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarBody",
                new
                {
                    Id,
                    body.Nombre,
                    body.Mililitros,
                    body.Precio,
                    body.Descripcion,
                    body.ImagenUrl,
                    body.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarBody",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Activar(Guid Id)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "ActivarBody",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid Id)
        {
            var body = await Obtener(Id);
            if (body == null)
                throw new Exception("No se encontró el body");
        }
        #endregion
    }
}