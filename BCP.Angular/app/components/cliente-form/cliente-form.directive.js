(function () {

    'use strict';

    angular.module('app').directive('clienteDirective', clienteDirective);

    function clienteDirective() {

        return {
            restrict: 'E',
            scope: {
                cliente: '=',
                labelButtonSubmit: '@',
                onButtonSubmitClick: '=',
                formularioMantenimientoCliente: '=',
                listaTiposDeDocumentos: '='
            },
            templateUrl: 'app/components/cliente-form/cliente-form.html'
        };

    }

})();