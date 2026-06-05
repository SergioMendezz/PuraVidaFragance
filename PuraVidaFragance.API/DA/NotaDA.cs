using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class NotaDA : INotaDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public NotaDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Catálogo de notas
        public async Task<IEnumerable<NotaResponse>> Obtener()
        {
            return await _sqlConnection.QueryAsync<NotaResponse>(
                "ObtenerNotas",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<NotaResponse> Obtener(Guid Id)
        {
            return await _sqlConnection.QueryFirstOrDefaultAsync<NotaResponse>(
                "ObtenerNota",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Agregar(NotaRequest nota)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarNota",
                new
                {
                    Id = Guid.NewGuid(),
                    Nombre = nota.Nombre,
                    ColorHex = nota.ColorHex
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Editar(Guid Id, NotaRequest nota)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarNota",
                new
                {
                    Id = Id,
                    Nombre = nota.Nombre,
                    ColorHex = nota.ColorHex
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarNota",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Notas de un perfume
        public async Task<IEnumerable<NotaPerfumeResponse>> ObtenerPorPerfume(Guid IdPerfume)
        {
            return await _sqlConnection.QueryAsync<NotaPerfumeResponse>(
                "ObtenerNotasPorPerfume",
                new { IdPerfume },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> AgregarAPerfume(NotaPerfumeRequest request)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarNotaAPerfume",
                new
                {
                    Id = Guid.NewGuid(),
                    IdPerfume = request.IdPerfume,
                    IdNota = request.IdNota,
                    Intensidad = request.Intensidad
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> EliminarDePerfume(Guid IdPerfume, Guid IdNota)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarNotaDePerfume",
                new { IdPerfume, IdNota },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid Id)
        {
            var nota = await Obtener(Id);
            if (nota == null)
                throw new Exception("No se encontró la nota");
        }
        #endregion
    }
}