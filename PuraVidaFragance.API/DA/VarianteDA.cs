using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class VarianteDA : IVarianteDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public VarianteDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<VarianteResponse>> ObtenerPorPerfume(Guid IdPerfume)
        {
            return await _sqlConnection.QueryAsync<VarianteResponse>(
                "ObtenerVariantesPorPerfume",
                new { IdPerfume },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Agregar(VarianteRequest variante)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarVariante",
                new
                {
                    Id = Guid.NewGuid(),
                    IdPerfume = variante.IdPerfume,
                    Tipo = variante.Tipo,
                    Mililitros = variante.Mililitros,
                    Precio = variante.Precio,
                    Stock = variante.Stock
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Editar(Guid Id, VarianteRequest variante)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarVariante",
                new
                {
                    Id = Id,
                    Tipo = variante.Tipo,
                    Mililitros = variante.Mililitros,
                    Precio = variante.Precio,
                    Stock = variante.Stock
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarVariante",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion
    }
}