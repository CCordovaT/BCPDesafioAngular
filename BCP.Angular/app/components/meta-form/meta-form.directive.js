(function () {

    'use strict';

    angular.module('app').directive('metaDirective', metaDirective);

    function metaDirective() {

        return {
            restrict: 'E',
            scope: {
                meta: '=',
                labelButtonSubmit: '@',
                onButtonSubmitClick: '=',
                formularioMantenimientoMeta: '='
            },
            templateUrl: 'app/components/meta-form/meta-form.html'
        };

    }

})();