(function () {

    'use strict';

    angular.module('app').factory('catalogoService', catalogoService);

    catalogoService.$inject = ['globalService', 'dataService'];

    function catalogoService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/catalogos';

        servicio.obtenerTiposDeDocumento = obtenerTiposDeDocumento;

        return servicio;

        function obtenerTiposDeDocumento() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/tipos-de-documento`);

        }

    }

})();