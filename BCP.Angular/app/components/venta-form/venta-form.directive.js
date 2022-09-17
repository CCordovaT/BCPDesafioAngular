(function () {

    'use strict';

    angular.module('app').directive('ventaDirective', ventaDirective);

    function ventaDirective() {

        return {
            restrict: 'E',
            scope: {
                venta: '=',
                labelButtonSubmit: '@',
                onButtonSubmitClick: '=',
                formularioMantenimientoVenta: '=',
                listaProductos: '=',
                listaClientes: '='
            },
            templateUrl: 'app/components/venta-form/venta-form.html'
        };

    }

})();