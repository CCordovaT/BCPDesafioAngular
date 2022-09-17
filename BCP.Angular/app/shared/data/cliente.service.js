(function () {

    'use strict';

    angular.module('app').factory('clienteService', clienteService);

    clienteService.$inject = ['globalService', 'dataService'];

    function clienteService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/clientes';

        servicio.obtenerTodos = obtenerTodos;
        servicio.obtenerListaSimple = obtenerListaSimple;
        servicio.insertarCliente = insertarCliente;

        return servicio;

        function obtenerTodos() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}`);

        }

        function obtenerListaSimple() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/lista-simple`);

        }

        function insertarCliente(cliente) {

            return dataService.postData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}`, cliente);

        }

    }

})();