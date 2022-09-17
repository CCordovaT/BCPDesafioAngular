(function () {

    'use strict';

    angular.module('app').config(configurarDebug).run(appLoad);

    configurarDebug.$inject = ['$compileProvider'];

    function configurarDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

    appLoad.$inject = ['$http', 'localStorageService', 'globalService', '$state'];

    function appLoad($http, localStorageService, globalService, $state) {

        const datosAlmacenados = localStorageService.get('userToken');

        if (datosAlmacenados && datosAlmacenados.token && datosAlmacenados.codUsuario && datosAlmacenados.direccionIP) {

            $http.defaults.headers.common.Authorization = 'Bearer ' + datosAlmacenados.token;
            $http.defaults.headers.common.direccionIP = datosAlmacenados.direccionIP;

            globalService.codUsuario = datosAlmacenados.codUsuario;

        } else {

            $state.go('login');

        }

        angular.element(window).resize(() => {

            if (angular.element(window).width() >= 1200) {

                angular.element('#mnuPrincipal').removeClass('show');
                angular.element('.overlay').removeClass('active');

            };

        })
    }

})();