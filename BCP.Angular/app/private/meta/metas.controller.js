(function () {

    'use strict';

    angular.module('app').controller('metaController', metaController);

    metaController.$inject = ['globalService', 'usuarioService', 'utilService', 'appConst', 'metaService', '$state'];

    function metaController(globalService, usuarioService, utilService, appConst, metaService, $state) {

        const vm = this;

        vm.etiquetaHeaderModal = '';
        vm.idPanelMantenimientoMeta = 'panelMantenimientoMeta';
        vm.etiquetaSubmitButtonModal = 'Guardar';
        vm.mensajeAlertaInformativa = '';

        vm.metaSeleccionada = {};
        vm.listaMetas = [];
        vm.formularioMantenimientoMeta = [];
        vm.listaAsesoresPorEncargado = [];
        vm.periodoActual = ''

        vm.onButtonNuevaMetaClick = onButtonNuevaMetaClick;

        onLoad();

        function onLoad() {

            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        const fechaActual = new Date();

                        vm.periodoActual = `${utilService.obtenerNombreMes(fechaActual.getMonth()).toUpperCase()} - ${fechaActual.getFullYear()}`; 

                        listarMetasPorEncargadoPorPeriodo();

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    }
                )
        }

        function listarMetasPorEncargadoPorPeriodo() {

            const fechaActual = new Date();

            metaService.ObtenerMetasPorEncargadoPorPeriodo(globalService.usuarioLogueado.idUsuario, fechaActual.getMonth() + 1, fechaActual.getFullYear())
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            utilService.mostrarMensajeInfo("No tiene asesores asignados");
                            return;

                        }

                        Swal.close();

                        const listaMetas = respuesta.data.data;

                        listaMetas.forEach(m => {
                            m.totalPuntosFaltantes = m.totalPuntosMeta > m.totalPuntosObtenidos ? (m.totalPuntosMeta - m.totalPuntosObtenidos).toFixed(2) : 0.0;
                        });

                        vm.listaMetas = listaMetas;

                    }, function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )

        }

        function onButtonNuevaMetaClick(meta) {

            vm.etiquetaHeaderModal = 'Nueva meta';
            vm.onButtonGuardarMetaClick = insertarMeta;

            const fechaActual = new Date();

            vm.metaSeleccionada = {
                nombreAsesor: meta.nombreAsesor,
                idUsuario: meta.idUsuario,
                mes: fechaActual.getMonth() + 1,
                anio: fechaActual.getFullYear()
            };

            vm.formularioMantenimientoMeta.$setPristine();

            utilService.abrirModal(vm.idPanelMantenimientoMeta);
        }

        function insertarMeta() {

            if (!vm.formularioMantenimientoMeta.$valid) return;

            utilService.mostrarMensajeDeCarga('Guardando datos...');

            metaService.insertarMeta(vm.metaSeleccionada)
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();

                        utilService.cerrarModal(vm.idPanelMantenimientoMeta);

                        vm.mensajeAlertaInformativa = 'Se guardaron los datos correctamente';
                        utilService.mostrarAlertaTemporal('panelAlerta');

                        listarMetasPorEncargadoPorPeriodo();

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );

        }

    }

})();