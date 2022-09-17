(function () {

    'use strict';

    angular.module('app').factory('vendedorService', vendedorService);

    vendedorService.$inject = ['globalService', 'dataService'];

    function vendedorService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'vendedores';

        servicio.obtenerVendedoresPorCodUsuario = obtenerVendedoresPorCodUsuario;

        return servicio;

        function obtenerVendedoresPorCodUsuario(codUsuario) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?pcCodUsuario=${codUsuario}`);

        }

    };

})();