(function () {

    'use strict';

    angular.module('app').config(configurarRutas);

    configurarRutas.$inject = ['$stateProvider'];

    function configurarRutas($stateProvider) {

        $stateProvider
            .state('clientes', {
                url: '/listado-clientes',
                templateUrl: 'app/private/cliente/listado-clientes.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/public/login/login.html'
            })
            .state('otherwise', {
                url: '*path',
                templateUrl: 'app/private/cliente/listado-clientes.html'
            });

    }

})();