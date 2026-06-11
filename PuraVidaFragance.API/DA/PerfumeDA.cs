using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class PerfumeDA : IPerfumeDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public PerfumeDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<PerfumeResponse>> Obtener()
        {
            var perfumes = await _sqlConnection.QueryAsync<PerfumeResponse>("ObtenerPerfumes",
                commandType: System.Data.CommandType.StoredProcedure);

            foreach (var perfume in perfumes)
            {
                perfume.Variantes = (await _sqlConnection.QueryAsync<VarianteResponse>(
                    "ObtenerVariantesPorPerfume",
                    new { IdPerfume = perfume.Id },
                    commandType: System.Data.CommandType.StoredProcedure)).ToList();

                perfume.Notas = (await _sqlConnection.QueryAsync<NotaResponse>(
                    "ObtenerNotasPorPerfume",
                    new { IdPerfume = perfume.Id },
                    commandType: System.Data.CommandType.StoredProcedure)).ToList();
            }

            return perfumes;
        }

        public async Task<PerfumeResponse> Obtener(Guid Id)
        {
            var perfume = await _sqlConnection.QueryFirstOrDefaultAsync<PerfumeResponse>(
                "ObtenerPerfume",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);

            if (perfume != null)
            {
                perfume.Variantes = (await _sqlConnection.QueryAsync<VarianteResponse>(
                    "ObtenerVariantesPorPerfume",
                    new { IdPerfume = perfume.Id },
                    commandType: System.Data.CommandType.StoredProcedure)).ToList();

                perfume.Notas = (await _sqlConnection.QueryAsync<NotaResponse>(
                    "ObtenerNotasPorPerfume",
                    new { IdPerfume = perfume.Id },
                    commandType: System.Data.CommandType.StoredProcedure)).ToList();
            }

            return perfume;
        }

        public async Task<Guid> Agregar(PerfumeRequest perfume)
        {
            var resultado = await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarPerfume",
                new
                {
                    Id = Guid.NewGuid(),
                    IdMarca = perfume.IdMarca,
                    Nombre = perfume.Nombre,
                    Genero = perfume.Genero,
                    Descripcion = perfume.Descripcion,
                    ImagenUrl = perfume.ImagenUrl
                },
                commandType: System.Data.CommandType.StoredProcedure);

            return resultado;
        }

        public async Task<Guid> Editar(Guid Id, PerfumeRequest perfume)
        {
            await VerificarExiste(Id);

            var resultado = await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarPerfume",
                new
                {
                    Id = Id,
                    IdMarca = perfume.IdMarca,
                    Nombre = perfume.Nombre,
                    Genero = perfume.Genero,
                    Descripcion = perfume.Descripcion,
                    ImagenUrl = perfume.ImagenUrl
                },
                commandType: System.Data.CommandType.StoredProcedure);

            return resultado;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);

            var resultado = await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarPerfume",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);

            return resultado;
        }

        public async Task<Guid> Activar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "ActivarPerfume",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task VerificarExiste(Guid Id)
        {
            var perfume = await Obtener(Id);
            if (perfume == null)
                throw new Exception("No se encontró el perfume");
        }
        #endregion
    }
}
