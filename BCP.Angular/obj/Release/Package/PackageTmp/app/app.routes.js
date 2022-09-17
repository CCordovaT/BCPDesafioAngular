(function () {

    'use strict';

    angular.module('app').config(configurarRutas);

    configurarRutas.$inject = ['$stateProvider'];

    function configurarRutas($stateProvider) {

        $stateProvider
            .state('prospectos', {
                url: '/listado-prospectos',
                templateUrl: 'app/private/prospecto/listado-prospectos.html'
            })
            .state('simulador', {
                url: '/simulador',
                templateUrl: 'app/private/simulador-electro/simulador-electro.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/public/login/login.html'
            })
            .state('otherwise', {
                url: '*path',
                templateUrl: 'app/private/prospecto/listado-prospectos.html'
            });

    }

})();