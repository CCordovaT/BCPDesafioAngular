(function () {

    'use strict';

    angular.module('app').factory('prospectoService', prospectoService);

    prospectoService.$inject = ['globalService', 'dataService', 'utilService'];

    function prospectoService(globalService, dataService, utilService) {

        const servicio = {};
        const RUTA_RECURSO = 'prospectos';

        servicio.obtenerProspectosRegistrados = obtenerProspectosRegistrados;
        servicio.esUnDocumentoNuevoParaProspecto = esUnDocumentoNuevoParaProspecto;
        servicio.registrarOActualizarProspecto = registrarOActualizarProspecto;
        servicio.obtenerProspectoPorCodigo = obtenerProspectoPorCodigo;

        return servicio;

        function obtenerProspectosRegistrados(codPrograma, codVendedor, nroDocumentoONombre, fechaRegistroInicial, fechaRegistroFinal) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?pnCodTipoPrograma=${codPrograma}&pnCodVendedor=${codVendedor}&pcNroDocumentoONombre=${nroDocumentoONombre}&pdFechaRegistroInicial=${utilService.convertirFechaAFormatoISO(fechaRegistroInicial)}&pdFechaRegistroFinal=${utilService.convertirFechaAFormatoISO(fechaRegistroFinal)}`);

        }

        function esUnDocumentoNuevoParaProspecto(codPrograma, codTipoDocumento, nroDocumento) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/validar-documento?pnCodTipoPrograma=${codPrograma}&pnCodTipoDocumento=${codTipoDocumento}&pcNroDocumento=${nroDocumento}`);

        }

        function registrarOActualizarProspecto(prospecto) {

            return dataService.postData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}`, prospecto);

        }

        function obtenerProspectoPorCodigo(codProspecto, esProspectoAntiguo) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/${codProspecto}?pbEsProspectoAntiguo=${esProspectoAntiguo}`);

        }

    }

})()