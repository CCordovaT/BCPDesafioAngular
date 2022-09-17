(function () {

    'use strict';

    angular.module('app').factory('catalogoCodigoService', catalogoCodigoService);

    catalogoCodigoService.$inject = ['appConst', 'dataService', 'globalService'];

    function catalogoCodigoService(appConst, dataService, globalService) {

        const servicio = {};
        const RUTA_RECURSO = 'catalogos';

        servicio.obtenerTiposProgramaCampania = obtenerTiposProgramaCampania;
        servicio.obtenerTiposDeDocumentoPrincipales = obtenerTiposDeDocumentoPrincipales;
        servicio.obtenerCatalogosParaMantenimientoDeProspectos = obtenerCatalogosParaMantenimientoDeProspectos;

        return servicio;

        function obtenerTiposProgramaCampania() {

            const codCatalogo = appConst.codCatalogo.PROGRAMAS_CAMPANIA;

            return [
                { nCodigo: codCatalogo, nValor: '1', cNomCod: 'PUERTA A PUERTA' },
                { nCodigo: codCatalogo, nValor: '2', cNomCod: 'SOCIAL SELLING' }
            ];

        }

        function obtenerTiposDeDocumentoPrincipales() {

            const codCatalogo = appConst.codCatalogo.TIPO_DOCUMENTO;

            return [
                { nCodigo: codCatalogo, nValor: '1', cNomCod: 'DNI' },
                { nCodigo: codCatalogo, nValor: '3', cNomCod: 'CARNE EXTRANJERIA' },
                { nCodigo: codCatalogo, nValor: '10', cNomCod: 'PERMISO TEMPORAL' },
                { nCodigo: codCatalogo, nValor: '11', cNomCod: 'CÉDULA IDENTIDAD' },
                { nCodigo: codCatalogo, nValor: '12', cNomCod: 'CARNET REFUGIADO' }
            ];

        }

        function obtenerCatalogosParaMantenimientoDeProspectos() {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/marketing-digital`);

        }

    }

})();