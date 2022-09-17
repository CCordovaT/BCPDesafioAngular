(function () {

    'use strict';

    angular.module('app').controller('ventaController', ventaController);

    ventaController.$inject = ['globalService', 'usuarioService', 'utilService', 'clienteService', 'appConst', 'productoService', 'ventaService', '$state', '$q'];

    function ventaController(globalService, usuarioService, utilService, clienteService, appConst, productoService, ventaService, $state, $q) {

        const vm = this;

        vm.etiquetaHeaderModal = '';
        vm.idPanelMantenimientoVenta = 'panelMantenimientoVentas';
        vm.etiquetaSubmitButtonModal = 'Guardar';
        vm.mensajeAlertaInformativa = '';

        vm.ventaSeleccionada = {};
        vm.listaVentas = [];
        vm.formularioMantenimientoVenta = [];
        vm.listaProductos = [];
        vm.listaClientes = [];

        vm.onButtonNuevaVentaClick = onButtonNuevaVentaClick;

        onLoad();

        function onLoad() {

            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        listarVentasPorUsuarioPorPeriodo();

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    }
                )
        }

        function listarVentasPorUsuarioPorPeriodo() {

            const fechaActual = new Date();

            ventaService.obtenerPorUsuarioPorPeriodo(globalService.usuarioLogueado.idUsuario, fechaActual.getMonth() + 1, fechaActual.getFullYear())
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            utilService.mostrarMensajeInfo("No se encontraron ventas registradas en el periodo actual");
                            return;

                        }

                        Swal.close();

                        vm.listaVentas = respuesta.data.data;

                    }, function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )

        }

        function onButtonNuevaVentaClick() {

            vm.etiquetaHeaderModal = 'Nueva venta';
            vm.onButtonGuardarVentaClick = insertarVenta;

            vm.ventaSeleccionada = {};

            vm.formularioMantenimientoVenta.$setPristine();

            obtenerListadosParaSelectsDelFormularioVentas()
                .then(
                    function onSuccess(respuesta) {
                        utilService.abrirModal(vm.idPanelMantenimientoVenta);
                    },
                    function onError(error) {
                        utilService.mostrarMensajeError(error);
                    }
                )
        }

        function obtenerListadosParaSelectsDelFormularioVentas() {

            const promesa = $q.defer();

            if (vm.listaProductos.length === 0 && vm.listaClientes.length === 0) {

                productoService.obtenerListaSimple()
                    .then(function onSuccess(respuesta) {

                        vm.listaProductos = respuesta.data.data;

                        return clienteService.obtenerListaSimple();

                    })
                    .then(
                        function onSuccess(respuesta) {

                            vm.listaClientes = respuesta.data.data;

                            promesa.resolve({

                                esCorrecto: true,
                                cMensajeError: ''

                            });

                        },
                        function onError(error) {

                            promesa.reject({

                                esCorrecto: false,
                                cMensajeError: utilService.obtenerMensajerError(error)

                            });

                        }
                    );

            } else {

                promesa.resolve({

                    esCorrecto: true,
                    cMensajeError: ''

                });

            }

            return promesa.promise;

        }

        function insertarVenta() {

            if (!vm.formularioMantenimientoVenta.$valid) return;

            vm.ventaSeleccionada.idCliente = parseInt(vm.ventaSeleccionada.clienteSeleccionado.idCliente);
            vm.ventaSeleccionada.idProducto = parseInt(vm.ventaSeleccionada.productoSeleccionado.idProducto);
            vm.ventaSeleccionada.idUsuario = globalService.usuarioLogueado.idUsuario;

            utilService.mostrarMensajeDeCarga('Guardando datos...');

            ventaService.insertarVenta(vm.ventaSeleccionada)
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();

                        utilService.cerrarModal(vm.idPanelMantenimientoVenta);

                        vm.mensajeAlertaInformativa = 'Se guardó la venta correctamente';
                        utilService.mostrarAlertaTemporal('panelAlerta');

                        listarVentasPorUsuarioPorPeriodo();

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );

        }

    }

})();