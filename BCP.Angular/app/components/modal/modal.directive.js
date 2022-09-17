(function () {

    'use strict';

    angular.module('app').directive('modalDirective', modalDirective);

    function modalDirective() {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                panelHeaderText: '@',
                onUnload: '=',
                idPanel: '@'
            },
            templateUrl: 'app/components/modal/modal.html'
        };

    }

})();