(function () {

    'use strict';

    angular.module('app').factory('metaService', metaService);

    metaService.$inject = ['globalService', 'dataService'];

    function metaService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/metas-por-asesor';

        servicio.ObtenerMetasPorEncargadoPorPeriodo = ObtenerMetasPorEncargadoPorPeriodo;
        servicio.insertarMeta = insertarMeta;

        return servicio;

        function ObtenerMetasPorEncargadoPorPeriodo(idUsuarioEncargado, nroMes, anio) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?idUsuarioEncargado=${idUsuarioEncargado}&nroMes=${nroMes}&anio=${anio}`);

        }

        function insertarMeta(meta) {

            return dataService.postData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}`, meta);

        }
    }

})();