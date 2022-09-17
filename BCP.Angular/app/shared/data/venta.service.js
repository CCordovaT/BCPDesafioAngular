(function () {

    'use strict';

    angular.module('app').factory('ventaService', ventaService);

    ventaService.$inject = ['globalService', 'dataService'];

    function ventaService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/ventas';

        servicio.obtenerPorUsuarioPorPeriodo = obtenerPorUsuarioPorPeriodo;
        servicio.insertarVenta = insertarVenta;

        return servicio;

        function obtenerPorUsuarioPorPeriodo(idUsuario, nroMes, anio) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?idUsuario=${idUsuario}&nroMes=${nroMes}&anio=${anio}`);

        }

        function insertarVenta(venta) {

            return dataService.postData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}`, venta);

        }

    }

})();