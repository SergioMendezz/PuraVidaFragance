using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DA
{
    public class SetDA : ISetDA
    {
        private readonly IRepositorioDapper _repositorioDapper;
        private readonly SqlConnection _sqlConnection;

        #region Constructor
        public SetDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlConnection = _repositorioDapper.ObtenerRepositorio();
        }
        #endregion

        #region Operaciones
        public async Task<IEnumerable<SetResponse>> Obtener()
        {
            var sets = await _sqlConnection.QueryAsync<SetResponse>(
                "ObtenerSets",
                commandType: System.Data.CommandType.StoredProcedure);

            foreach (var set in sets)
                set.Items = (await ObtenerItems(set.Id)).ToList();

            return sets;
        }

        public async Task<SetResponse> Obtener(Guid Id)
        {
            var set = await _sqlConnection.QueryFirstOrDefaultAsync<SetResponse>(
                "ObtenerSet",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);

            if (set != null)
                set.Items = (await ObtenerItems(set.Id)).ToList();

            return set;
        }

        public async Task<Guid> Agregar(SetRequest setReq)
        {
            var id = Guid.NewGuid();

            await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarSet",
                new
                {
                    Id = id,
                    setReq.Nombre,
                    setReq.Precio,
                    setReq.Descripcion,
                    setReq.ImagenUrl,
                    setReq.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);

            foreach (var item in setReq.Items)
                await AgregarItem(id, item);

            return id;
        }

        public async Task<Guid> Editar(Guid Id, SetRequest setReq)
        {
            await VerificarExiste(Id);

            await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EditarSet",
                new
                {
                    Id,
                    setReq.Nombre,
                    setReq.Precio,
                    setReq.Descripcion,
                    setReq.ImagenUrl,
                    setReq.IdMarca
                },
                commandType: System.Data.CommandType.StoredProcedure);

            var itemsActuales = await ObtenerItems(Id);
            foreach (var item in itemsActuales)
                await _sqlConnection.ExecuteAsync(
                    "EliminarItemSet",
                    new { item.Id },
                    commandType: System.Data.CommandType.StoredProcedure);

            foreach (var item in setReq.Items)
                await AgregarItem(Id, item);

            return Id;
        }

        public async Task<Guid> Eliminar(Guid Id)
        {
            await VerificarExiste(Id);
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "EliminarSet",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> Activar(Guid Id)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "ActivarSet",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
        }
        #endregion

        #region Helpers
        private async Task<IEnumerable<ItemSetResponse>> ObtenerItems(Guid IdSet)
        {
            return await _sqlConnection.QueryAsync<ItemSetResponse>(
                "ObtenerItemsPorSet",
                new { IdSet },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        private async Task AgregarItem(Guid IdSet, ItemSetRequest item)
        {
            await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarItemSet",
                new
                {
                    Id = Guid.NewGuid(),
                    IdSet,
                    item.TipoProducto,
                    item.IdProducto,
                    item.NombreItem,
                    item.Cantidad,
                    item.Descripcion
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        private async Task VerificarExiste(Guid Id)
        {
            var set = await _sqlConnection.QueryFirstOrDefaultAsync<SetResponse>(
                "ObtenerSet",
                new { Id },
                commandType: System.Data.CommandType.StoredProcedure);
            if (set == null)
                throw new Exception("No se encontró el set");
        }
        #endregion
    }
}