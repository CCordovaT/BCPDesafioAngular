(function () {

    'use strict';

    angular.module('app').controller('simuladorElectroController', simuladorElectroController);

    simuladorElectroController.$inject = ['globalService', 'usuarioService', 'utilService', 'electrodomesticoModeloService', 'appConst', '$state'];

    function simuladorElectroController(globalService, usuarioService, utilService, electrodomesticoModeloService, appConst, $state) {

        const vm = this;

        const ID_PANEL_BUSQUEDA = 'panelResultadoBusqueda';

        let solicitarBusquedaDeArticulos = ejecutarFuncionAlTerminarCuentaRegresiva(obtenerArticulosPorFiltro, 700);

        vm.filtroBusqueda = '';
        vm.nroArticulosEncontrados = 0;
        vm.longitudMinimaBusqueda = 4;
        vm.estaBuscandoArticulos = false;
        vm.estaCalculandoPrestamo = false;
        vm.listaArticulosEncontrados = [];
        vm.articuloSeleccionado = {};

        vm.onInputFiltroBusquedaChanged = onInputFiltroBusquedaChanged;
        vm.onInputFiltroBusquedaClick = onInputFiltroBusquedaClick;
        vm.onInputFiltroBusquedaKeyUp = onInputFiltroBusquedaKeyUp;
        vm.onFilaArticuloSelected = onFilaArticuloSelected;
        vm.onFocusFormControl = onFocusFormControl;

        onLoad();

        function onLoad() {

            document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'none';
            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    });
        }

        function onInputFiltroBusquedaChanged() {

            if (vm.filtroBusqueda) {

                solicitarBusquedaDeArticulos(vm.filtroBusqueda);

            } else {

                vm.listaArticulosEncontrados = [];
                document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'none';

            }

        }

        function ejecutarFuncionAlTerminarCuentaRegresiva(func, delay) {

            let cuentaRegresiva;

            return function (...arg) {

                clearTimeout(cuentaRegresiva);

                cuentaRegresiva = setTimeout(function () {

                    func(...arg);

                }, delay);

            };

        }

        function obtenerArticulosPorFiltro(filtroBusqueda) {

            vm.estaBuscandoArticulos = true;
            document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'block';
            document.getElementById(ID_PANEL_BUSQUEDA).scrollTop = 0;

            electrodomesticoModeloService.obtenerModelosPorFiltroDescripcion(filtroBusqueda)
                .then(
                    function onSuccess(respuesta) {

                        vm.nroArticulosEncontrados = 0;

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            vm.listaArticulosEncontrados = [];
                            return;

                        }

                        const listaArticulosEncontrados = respuesta.data.oData;

                        listaArticulosEncontrados.forEach(familia => vm.nroArticulosEncontrados += familia.listaArticulos.length);

                        vm.listaArticulosEncontrados = listaArticulosEncontrados;

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )
                .finally(function onFinally() {

                    vm.estaBuscandoArticulos = false;

                });
        }

        function onInputFiltroBusquedaClick() {

            if (vm.filtroBusqueda && utilService.estaOculto(document.getElementById(ID_PANEL_BUSQUEDA))) document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'block';

        }

        function onFilaArticuloSelected(articulo, familia) {

            vm.estaCalculandoPrestamo = true;

            vm.articuloSeleccionado = articulo;
            vm.articuloSeleccionado.cDescripcionFamilia = familia;

            electrodomesticoModeloService.calcularCotizacion(articulo.nCodModelo)
                .then(
                    function onSuccess(respuesta) {

                        vm.articuloSeleccionado.nMontoPrestamo = respuesta.data.oData.nValorPrestamo;

                        document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'none';

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )
                .finally(function onFinally() {

                    vm.estaCalculandoPrestamo = false;

                });
        }

        function onInputFiltroBusquedaKeyUp(evento) {

            if (evento.keyCode == appConst.key.ESC) document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'none';

        }

        function onFocusFormControl() {

            document.getElementById(ID_PANEL_BUSQUEDA).style.display = 'none';

        }

    }

})();