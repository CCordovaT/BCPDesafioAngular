(function () {

    'use strict';

    angular.module('app').controller('loginController', loginController);

    loginController.$inject = ['authenticacionService', '$state', 'globalService'];

    function loginController(authenticacionService, $state, globalService) {

        const TEXTO_BOTON_LOGIN = 'CONTINUAR';
        const ID_INPUT_USUARIO = 'txtLoginUsuario';
        const ID_INPUT_PASSWORD = 'txtLoginPassword';
        const ID_BUTTON_CONTINUAR = 'btnContinuar';

        const vm = this;

        vm.datosLogueo = {};
        vm.onButtonContinuarClick = onButtonContinuarClick;
        vm.esperandoRespuestaLogueo = false;
        vm.mensajeErrorLogueo = '';

        onLoad();

        function onLoad() {

            globalService.ocultarMenu();
            mostrarControlesEnEspera(false);

        }

        function onButtonContinuarClick(frmLogin) {

            if (!frmLogin.$valid) return;

            vm.datosLogueo.codAccesoUsuario = vm.datosLogueo.codAccesoUsuario.toUpperCase();

            const respuestaLogueo = authenticacionService.loguearse(vm.datosLogueo);

            vm.esperandoRespuestaLogueo = true;
            mostrarControlesEnEspera(true);

            respuestaLogueo
                .then(
                    function onSuccess(respuesta) {

                        globalService.codAccesoUsuario = vm.datosLogueo.codAccesoUsuario;
                        $state.go('clientes');

                    },
                    function onError(error) {

                        vm.mensajeErrorLogueo = error.mensajeRespuesta;
                        vm.esperandoRespuestaLogueo = false;
                        mostrarControlesEnEspera(false);

                    }
                );

        }

        function mostrarControlesEnEspera(estaEsperando) {

            if (estaEsperando) {

                angular.element(`#${ID_INPUT_USUARIO}`).attr('disabled', 'disabled');
                angular.element(`#${ID_INPUT_PASSWORD}`).attr('disabled', 'disabled');
                angular.element(`#${ID_BUTTON_CONTINUAR}`).html('<span class="fa fa-spinner fa-spin fa-2x"></span>');

            } else {

                angular.element(`#${ID_INPUT_USUARIO}`).removeAttr('disabled');
                angular.element(`#${ID_INPUT_PASSWORD}`).removeAttr('disabled');
                angular.element(`#${ID_BUTTON_CONTINUAR}`).html(TEXTO_BOTON_LOGIN);

            }

        }
    }

})();