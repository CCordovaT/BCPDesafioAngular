(function () {

    'use strict';

    angular.module('app').factory('productoService', productoService);

    productoService.$inject = ['globalService', 'dataService'];

    function productoService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/productos';

        servicio.obtenerListaSimple = obtenerListaSimple;

        return servicio;

        function obtenerListaSimple() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/lista-simple`);

        }

    }

})();