(function () {

    'use strict';

    angular.module('app').directive('prospectoDirective', prospectoDirective);

    function prospectoDirective() {

        return {
            restrict: 'E',
            scope: {
                prospecto: '=',
                labelButtonSubmit: '@',
                longitudMaximaNroDocumento: '=',
                onButtonSubmitClick: '=',
                formularioMantenimientoProspecto: '=',
                listaTiposDeDocumentos: '=',
                listaCanalesDeCaptacion: '=',
                listaProductosDeInteres: '=',
                onSelectTipoDocumentoChanged: '=',
                mensajeErrorFormatoNroDocumentoNoValido: '=',
                onButtonValidarDocumentoClick: '=',
                onInputNroDocumentoChanged: '='
            },
            templateUrl: 'app/components/prospecto-form/prospecto-form.html'
        };

    }

})();