(function () {

    'use strict';

    angular.module('app').factory('variableNegocioService', variableNegocioService);

    variableNegocioService.$inject = ['dataService', 'globalService'];

    function variableNegocioService(dataService, globalService) {

        const servicio = {};
        const RUTA_RECURSO = 'varnegocios';

        servicio.obtenerListaVariablesNegocioParaMarketingDigital = obtenerListaVariablesNegocioParaMarketingDigital;

        return servicio;

        function obtenerListaVariablesNegocioParaMarketingDigital() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/marketing-digital`);

        }

    };

})();