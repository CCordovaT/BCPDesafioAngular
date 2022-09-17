(function () {

    'use strict';

    angular.module('app').controller('appController', appController);

    appController.$inject = ['globalService', '$scope', 'authenticacionService'];

    function appController(globalService, $scope, authenticacionService) {

        const vm = this;

        vm.usuario = {};

        vm.esUsuarioLogueado = esUsuarioLogueado;
        vm.cerrarSesion = cerrarSesion;
        vm.ocultarMenu = globalService.ocultarMenu;
        vm.mostrarMenu = globalService.mostrarMenu;

        vm.marginLeftZero = { marginLeftZero: (!vm.esUsuarioLogueado) };

        $scope.init = function (urlApi) {

            globalService.rutaRaizApi = urlApi;

        };

        function esUsuarioLogueado() {

            if (!angular.equals({}, globalService.usuarioLogueado)) {

                vm.usuario = globalService.usuarioLogueado;
                return true;

            }

            return false;

        };

        function cerrarSesion() {

            authenticacionService.cerrarSesion();

        }

    }

})();