using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class MarcaDA : IMarcaDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public MarcaDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<MarcaResponse>> Obtener()
        {
            return await _sqlConnection.QueryAsync<MarcaResponse>(
                "ObtenerMarcas",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<MarcaResponse> Obtener(Guid Id)
        {
            return await _sqlConnection.QueryFirstOrDefaultAsync<MarcaResponse>(
                "ObtenerMarca",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Agregar(MarcaRequest marca)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarMarca",
                new
                {
                    Id = Guid.NewGuid(),
                    Nombre = marca.Nombre,
                    PaisOrigen = marca.PaisOrigen,
                    Descripcion = marca.Descripcion,
                    LogoUrl = marca.LogoUrl
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Editar(Guid Id, MarcaRequest marca)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarMarca",
                new
                {
                    Id = Id,
                    Nombre = marca.Nombre,
                    PaisOrigen = marca.PaisOrigen,
                    Descripcion = marca.Descripcion,
                    LogoUrl = marca.LogoUrl
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarMarca",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Activar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "ActivarMarca",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid Id)
        {
            var marca = await Obtener(Id);
            if (marca == null)
                throw new Exception("No se encontró la marca");
        }
        #endregion
    }
}