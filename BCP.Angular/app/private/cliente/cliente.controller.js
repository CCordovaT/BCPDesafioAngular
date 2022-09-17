(function () {

    'use strict';

    angular.module('app').controller('clienteController', clienteController);

    clienteController.$inject = ['globalService', '$state', 'usuarioService', 'utilService'];

    function clienteController(globalService, $state, usuarioService, utilService) {

        const vm = this;

        onLoad();

        function onLoad() {

            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();
                        console.log('usuario valido!');

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    })
                .then(
                    function onSuccess(respuesta) {


                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )
        }

    }

})();