(function () {

    'use strict';

    angular.module('app').controller('clienteController', clienteController);

    clienteController.$inject = ['globalService', 'usuarioService', 'utilService', 'clienteService', 'appConst', 'catalogoService', '$state'];

    function clienteController(globalService, usuarioService, utilService, clienteService, appConst, catalogoService, $state) {

        const vm = this;

        vm.etiquetaHeaderModal = '';
        vm.idPanelMantenimientoCliente = 'panelMantenimientoClientes';
        vm.etiquetaSubmitButtonModal = 'Guardar';
        vm.mensajeAlertaInformativa = '';

        vm.clienteSeleccionado = {};
        vm.listaClientes = [];
        vm.formularioMantenimientoCliente = [];
        vm.listaTiposDeDocumento = [];

        vm.onButtonNuevoClienteClick = onButtonNuevoClienteClick;

        onLoad();

        function onLoad() {

            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        listarClientes();

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    }
                )
        }

        function listarClientes() {

            clienteService.obtenerTodos()
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            utilService.mostrarMensajeInfo("No hay clientes registrados aun");
                            return;

                        }

                        Swal.close();

                        vm.listaClientes = respuesta.data.data;

                    }, function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )

        }

        function onButtonNuevoClienteClick() {

            vm.etiquetaHeaderModal = 'Nuevo cliente';
            vm.onButtonGuardarClienteClick = insertarCliente;

            vm.clienteSeleccionado = {
                tipoDocumento: { idTipoDocumento: appConst.tipoDocumento.DNI }
            };

            vm.formularioMantenimientoCliente.$setPristine();

            if (vm.listaTiposDeDocumento.length === 0) {

                catalogoService.obtenerTiposDeDocumento()
                    .then(
                        function onSuccess(respuesta) {
                            vm.listaTiposDeDocumento = respuesta.data.data;
                            utilService.abrirModal(vm.idPanelMantenimientoCliente);
                        },
                        function onError(error) {
                            utilService.mostrarMensajeError(error);
                        }
                    )

            } else {

                utilService.abrirModal(vm.idPanelMantenimientoCliente);
            }            
        }

        function insertarCliente() {

            if (!vm.formularioMantenimientoCliente.$valid) return;

            vm.clienteSeleccionado.idTipoDocumento = parseInt(vm.clienteSeleccionado.tipoDocumento.idTipoDocumento);
            vm.clienteSeleccionado.nombres = vm.clienteSeleccionado.nombres.trim().toUpperCase();
            vm.clienteSeleccionado.primerApellido = vm.clienteSeleccionado.primerApellido.trim().toUpperCase();
            vm.clienteSeleccionado.segundoApellido = vm.clienteSeleccionado.segundoApellido.trim().toUpperCase();

            utilService.mostrarMensajeDeCarga('Guardando datos...');

            clienteService.insertarCliente(vm.clienteSeleccionado)
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();

                        utilService.cerrarModal(vm.idPanelMantenimientoCliente);

                        vm.mensajeAlertaInformativa = 'Se guardaron los datos correctamente';
                        utilService.mostrarAlertaTemporal('panelAlerta');

                        listarClientes();

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );

        }

    }

})();