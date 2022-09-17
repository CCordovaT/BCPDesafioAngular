(function () {

	'use strict';

    angular.module('app').factory('electrodomesticoModeloService', electrodomesticoModeloService);

    electrodomesticoModeloService.$inject = ['globalService', 'dataService'];

    function electrodomesticoModeloService(globalService, dataService) {

        const servicio = {};
        const RUTA_RECURSO = 'electrodomestico-modelos';

        servicio.obtenerModelosPorFiltroDescripcion = obtenerModelosPorFiltroDescripcion;
        servicio.calcularCotizacion = calcularCotizacion;

        return servicio;

        function obtenerModelosPorFiltroDescripcion(filtroBusqueda) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?filtroDescripcion=${filtroBusqueda}`);

        }

        function calcularCotizacion(codModelo) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/${codModelo}/cotizar`);

        }

    }

})();