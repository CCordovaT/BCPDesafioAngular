(function () {

    'use strict';

    angular.module('app').controller('prospectoController', prospectoController);

    prospectoController.$inject = ['globalService', '$state', 'prospectoService', 'usuarioService', 'utilService', 'catalogoCodigoService', 'appConst', '$q', 'vendedorService'];

    function prospectoController(globalService, $state, prospectoService, usuarioService, utilService, catalogoCodigoService, appConst, $q, vendedorService) {

        const vm = this;

        const MENSAJE_PROSPECTOS_NO_ENCONTRADOS = 'No se encontraron prospectos registrados';
        const MENSAJE_PROSPECTO_NO_ENCONTRADO = 'No se puedo obtener la información del prospecto';

        vm.idPanelMantenimientoProspecto = 'panelMantenimientoProspecto';
        vm.ocultaFechas = false;
        vm.longitudMinimaBusqueda = 4;
        vm.longitudMaximaNroDocumento = 8;
        vm.onButtonGuardarProspectoClick = null;
        vm.mensajeErrorFormatoNroDocumentoNoValido = '';
        vm.mensajeAlertaInformativa = '';
        vm.codVendedor = 0;
        vm.etiquetaHeaderModal = '';

        vm.listaTiposPrograma = [];
        vm.listaProspectos = [];
        vm.filtrosBusqueda = {};
        vm.prospectoSeleccionado = {};
        vm.formularioMantenimientoProspecto = [];
        vm.listaTiposDeDocumento = [];
        vm.listaCanalesDeCaptacion = [];
        vm.listaProductosDeInteres = [];
        vm.listaVendedores = [];

        vm.onInputNroDocumentoONombreChanged = onInputNroDocumentoONombreChanged;
        vm.onButtonBuscarProspectosClick = onButtonBuscarProspectosClick;
        vm.onButtonNuevoProspectoClick = onButtonNuevoProspectoClick;
        vm.onButtonEditarProspectoClick = onButtonEditarProspectoClick;
        vm.onSelectTipoDocumentoChanged = onSelectTipoDocumentoChanged;
        vm.onButtonValidarDocumentoClick = onButtonValidarDocumentoClick;
        vm.onInputNroDocumentoChanged = onInputNroDocumentoChanged;
        vm.onSelectTipoProgramaChanged = onSelectTipoProgramaChanged;

        onLoad();        

        function onLoad() {

            globalService.ocultarMenu();

            utilService.mostrarMensajeDeCarga('Cargando...');

            usuarioService.existeSesionIniciada()
                .then(
                    function onSuccess(respuesta) {

                        return vendedorService.obtenerVendedoresPorCodUsuario(globalService.usuarioLogueado.cCodUsu);

                    },
                    function onError(error) {

                        Swal.close();
                        $state.go('login');

                    })
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            utilService.mostrarMensajeInfo("Usted no esta registrado como vendedor de alguna campaña, no podra consultar información");
                            return;

                        }

                        vm.listaVendedores = respuesta.data.oData;

                        const listaProgramasMarketing = catalogoCodigoService.obtenerTiposProgramaCampania();
                        let codTipoProgramaPorDefecto;

                        if (vm.listaVendedores.find(v => v.nTipoProgramaVendedor === parseInt(appConst.programaMarketing.PUERTA_A_PUERTA))) {
                            vm.listaTiposPrograma.push(listaProgramasMarketing.find(p => p.nValor === appConst.programaMarketing.PUERTA_A_PUERTA))
                            codTipoProgramaPorDefecto = appConst.programaMarketing.PUERTA_A_PUERTA;
                        }
                        if (vm.listaVendedores.find(v => v.nTipoProgramaVendedor === parseInt(appConst.programaMarketing.SOCIAL_SELLING))) {
                            vm.listaTiposPrograma.push(listaProgramasMarketing.find(p => p.nValor === appConst.programaMarketing.SOCIAL_SELLING))
                            codTipoProgramaPorDefecto = appConst.programaMarketing.SOCIAL_SELLING;
                        }

                        vm.filtrosBusqueda = {
                            tipoProgramaSeleccionado: vm.listaTiposPrograma.find(p => p.nValor === codTipoProgramaPorDefecto),
                            nroDocumentoONombre: '',
                            fechaInicial: utilService.obtenerInicioDeMes(globalService.variablesSesion.fechaSistema),
                            fechaFinal: globalService.variablesSesion.fechaSistema
                        };

                        vm.codVendedor = obtenerCodVendedorPorPrograma(vm.filtrosBusqueda.tipoProgramaSeleccionado.nValor);

                        listarProspectos(false);

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                )
        }

        function listarProspectos(muestraAlertaNoContenido) {

            utilService.mostrarMensajeDeCarga('Buscando...');

            let fechaInicial;
            let fechaFinal;

            if (vm.ocultaFechas) {

                fechaInicial = new Date();
                fechaFinal = new Date();

            } else {

                fechaInicial = vm.filtrosBusqueda.fechaInicial;
                fechaFinal = vm.filtrosBusqueda.fechaFinal;

            }

            prospectoService.obtenerProspectosRegistrados(vm.filtrosBusqueda.tipoProgramaSeleccionado.nValor, vm.codVendedor, vm.filtrosBusqueda.nroDocumentoONombre?.toUpperCase(), fechaInicial, fechaFinal)
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            vm.listaProspectos = [];

                            if (muestraAlertaNoContenido) {

                                utilService.mostrarMensajeInfo(MENSAJE_PROSPECTOS_NO_ENCONTRADOS);

                            } else {

                                Swal.close();

                            }

                            return;

                        }

                        Swal.close();

                        vm.listaProspectos = respuesta.data.oData;

                    }, function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );
        }

        function onInputNroDocumentoONombreChanged(frmBusquedaProspectos) {

            vm.ocultaFechas = frmBusquedaProspectos.txtNroDocumentoONombre.$viewValue.length > 0;

        }

        function onButtonBuscarProspectosClick(frmBusquedaProspectos) {

            if (vm.ocultaFechas && (!frmBusquedaProspectos.cboTipoPrograma.$valid || !frmBusquedaProspectos.txtNroDocumentoONombre.$valid)) return;
            if (!vm.ocultaFechas && (!frmBusquedaProspectos.cboTipoPrograma.$valid || !frmBusquedaProspectos.dtpFechaInicial.$valid || !frmBusquedaProspectos.dtpFechaFinal.$valid)) return;

            listarProspectos(true);
        }

        function onButtonNuevoProspectoClick() {

            vm.etiquetaHeaderModal = 'Nuevo prospecto';
            vm.etiquetaSubmitButtonModal = 'Guardar';
            vm.onButtonGuardarProspectoClick = registrarOActualizarProspecto;

            vm.prospectoSeleccionado = {
                nCodProspecto: 0,
                tipoDocumento: { nValor: appConst.tipoDocumento.DNI },
                dFechaRegistro: globalService.variablesSesion.fechaSistema,
                codEstadoValidacionDocumento: appConst.estadoValidacionDocumento.PENDIENTE,
                bEsProspectoAntiguo: false,
                cCodUsu: globalService.usuarioLogueado.cCodUsu,
                nTipoPrograma: vm.filtrosBusqueda.tipoProgramaSeleccionado.nValor,
                descripcionPrograma: vm.filtrosBusqueda.tipoProgramaSeleccionado.cNomCod,
                nCodVendedor: vm.codVendedor
            };

            vm.longitudMaximaNroDocumento = 8;
            vm.formularioMantenimientoProspecto.$setPristine();

            cargarCatalogosParaFormularioDeMantenimiento()
                .then(
                    function onSuccess(respuesta) {

                        utilService.abrirModal(vm.idPanelMantenimientoProspecto);

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );
        }

        function registrarOActualizarProspecto() {

            if (vm.prospectoSeleccionado.codEstadoValidacionDocumento === appConst.estadoValidacionDocumento.PENDIENTE) utilService.mostrarMensajeInfo('Debe validar el documento para guardar');
            if (vm.prospectoSeleccionado.codEstadoValidacionDocumento === appConst.estadoValidacionDocumento.RECHAZADO) utilService.mostrarMensajeInfo('El documento ya se encuentra registrado');

            if (vm.prospectoSeleccionado.codEstadoValidacionDocumento !== appConst.estadoValidacionDocumento.VALIDO) return;

            if (!vm.formularioMantenimientoProspecto.$valid) return;

            vm.prospectoSeleccionado.cNombres = vm.prospectoSeleccionado.cNombres.trim().toUpperCase();
            vm.prospectoSeleccionado.cApePat = vm.prospectoSeleccionado.cApePat.trim().toUpperCase();
            vm.prospectoSeleccionado.cApeMat = vm.prospectoSeleccionado.cApeMat.trim().toUpperCase();
            vm.prospectoSeleccionado.nTipoDocumento = parseInt(vm.prospectoSeleccionado.tipoDocumento.nValor);
            vm.prospectoSeleccionado.cCodUsu = globalService.usuarioLogueado.cCodUsu;
            vm.prospectoSeleccionado.bLiberarCliente = false;

            if (vm.prospectoSeleccionado.nCodProspecto === 0) {

                const fechaSistema = globalService.variablesSesion.fechaSistema;
                const horaActual = new Date();

                vm.prospectoSeleccionado.dFechaRegistro = new Date(Date.UTC(fechaSistema.getFullYear(), fechaSistema.getMonth(), fechaSistema.getDate(), horaActual.getHours(), horaActual.getMinutes()));

            }

            if (vm.prospectoSeleccionado.cTelefono) {

                vm.prospectoSeleccionado.nCodigoCiudad = 1;

                if (vm.prospectoSeleccionado.cTelefono.length === 9 && vm.prospectoSeleccionado.cTelefono.startsWith('9')) {

                    vm.prospectoSeleccionado.nTipo = appConst.tipoTelefono.CELULAR;

                } else {

                    vm.prospectoSeleccionado.nTipo = appConst.tipoTelefono.FIJO;

                }

            } else {

                vm.prospectoSeleccionado.nTipo = 0;
                vm.prospectoSeleccionado.nCodigoCiudad = 0;

            }

            vm.prospectoSeleccionado.cComentario = vm.prospectoSeleccionado.cComentario.trim().replace(/(?:\r|\n|\r\n)/g, ' ');
            vm.prospectoSeleccionado.bPignoraticio = vm.prospectoSeleccionado.productoInteres.nValor === '1';
            vm.prospectoSeleccionado.bPrendarioCuotas = vm.prospectoSeleccionado.productoInteres.nValor === '3';
            vm.prospectoSeleccionado.bPrendaTodo = vm.prospectoSeleccionado.productoInteres.nValor === '6';
            vm.prospectoSeleccionado.bCompraDeuda = vm.prospectoSeleccionado.productoInteres.nValor === '9';
            if (vm.prospectoSeleccionado.nTipoPrograma === appConst.programaMarketing.SOCIAL_SELLING) vm.prospectoSeleccionado.nCanalCaptacion = parseInt(vm.prospectoSeleccionado.canalCaptacion.nValor);

            utilService.mostrarMensajeDeCarga('Guardando datos...')

            prospectoService.registrarOActualizarProspecto(vm.prospectoSeleccionado)
                .then(
                    function onSuccess(respuesta) {

                        Swal.close();

                        utilService.cerrarModal(vm.idPanelMantenimientoProspecto);

                        if (vm.prospectoSeleccionado.nCodProspecto === 0) {

                            vm.ocultaFechas = false;

                            vm.filtrosBusqueda.nroDocumentoONombre = '';
                            vm.filtrosBusqueda.fechaInicial = utilService.obtenerInicioDeMes(globalService.variablesSesion.fechaSistema);
                            vm.filtrosBusqueda.fechaFinal = globalService.variablesSesion.fechaSistema;

                        }

                        vm.mensajeAlertaInformativa = 'Se guardaron los datos correctamente';
                        utilService.mostrarAlertaTemporal('panelAlerta');

                        listarProspectos(false);

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );
        }

        function cargarCatalogosParaFormularioDeMantenimiento() {

            const promesa = $q.defer();

            if (vm.listaCanalesDeCaptacion.length === 0 && vm.listaProductosDeInteres.length === 0 && vm.listaTiposDeDocumento.length === 0) {

                catalogoCodigoService.obtenerCatalogosParaMantenimientoDeProspectos()
                    .then(
                        function onSuccess(respuesta) {

                            const listaCatalogos = respuesta.data.oData;

                            vm.listaCanalesDeCaptacion = listaCatalogos.filter(c => c.nCodigo === appConst.codCatalogo.CANALES_CAPTACION);
                            vm.listaProductosDeInteres = listaCatalogos.filter(c => c.nCodigo === appConst.codCatalogo.PRODUCTOS_INTERES);
                            vm.listaTiposDeDocumento = catalogoCodigoService.obtenerTiposDeDocumentoPrincipales();

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


        function onButtonEditarProspectoClick(prospecto) {

            vm.etiquetaHeaderModal = 'Editar prospecto';
            vm.etiquetaSubmitButtonModal = 'Guardar';
            vm.onButtonGuardarProspectoClick = registrarOActualizarProspecto;
            vm.formularioMantenimientoProspecto.$setPristine();

            cargarCatalogosParaFormularioDeMantenimiento()
                .then(
                    function onSuccess(respuesta) {

                        return prospectoService.obtenerProspectoPorCodigo(prospecto.nCodProspecto, prospecto.bEsProspectoAntiguo);

                    })
                .then(
                    function onSuccess(respuesta) {

                        if (respuesta.status === appConst.statusResponse.NO_CONTENT) {

                            utilService.mostrarMensajeInfo(MENSAJE_PROSPECTO_NO_ENCONTRADO);
                            return;

                        }

                        vm.prospectoSeleccionado = respuesta.data.oData;

                        vm.prospectoSeleccionado.descripcionPrograma = vm.listaTiposPrograma.find(p => p.nValor === vm.prospectoSeleccionado.nTipoPrograma.toString()).cNomCod;
                        vm.prospectoSeleccionado.tipoDocumento = { nValor: vm.prospectoSeleccionado.nTipoDocumento.toString() };

                        let codProductoInteres = 0;

                        if (vm.prospectoSeleccionado.bPignoraticio) codProductoInteres = '1';
                        if (vm.prospectoSeleccionado.bPrendarioCuotas) codProductoInteres = '3';
                        if (vm.prospectoSeleccionado.bPrendaTodo) codProductoInteres = '6';
                        if (vm.prospectoSeleccionado.bCompraDeuda) codProductoInteres = '9';

                        vm.prospectoSeleccionado.productoInteres = { nValor: codProductoInteres };
                        vm.prospectoSeleccionado.canalCaptacion = { nValor: vm.prospectoSeleccionado.nCanalCaptacion.toString() };
                        vm.prospectoSeleccionado.codEstadoValidacionDocumento = appConst.estadoValidacionDocumento.VALIDO;

                        vm.longitudMaximaNroDocumento = obtenerLongitudMaximoNroDocumentoPorTipo(vm.prospectoSeleccionado.nTipoDocumento.toString())

                        utilService.abrirModal(vm.idPanelMantenimientoProspecto);

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);

                    }
                );
        }

        function onSelectTipoDocumentoChanged() {

            vm.prospectoSeleccionado.codEstadoValidacionDocumento = appConst.estadoValidacionDocumento.PENDIENTE;
            vm.longitudMaximaNroDocumento = obtenerLongitudMaximoNroDocumentoPorTipo(vm.prospectoSeleccionado.tipoDocumento.nValor.toString());

        }

        function obtenerLongitudMaximoNroDocumentoPorTipo(tipoDocumento) {

            switch (tipoDocumento) {

                case appConst.tipoDocumento.DNI: return 8;
                case appConst.tipoDocumento.CEDULA_IDENTIDAD: return 12;

                default: return 9;
            }

        }

        function onButtonValidarDocumentoClick() {

            vm.formularioMantenimientoProspecto.txtNroDocumento.$setDirty();
            if (vm.prospectoSeleccionado.cDocumento) validarFormatoNroDocumento();

            if (!vm.formularioMantenimientoProspecto.cboTipoDocumento.$valid || !vm.formularioMantenimientoProspecto.txtNroDocumento.$valid) return;

            document.getElementById('btnValidarDocumento').innerHTML = '<span class="fa fa-spinner fa-spin fa-2x"></span>';

            prospectoService.esUnDocumentoNuevoParaProspecto(vm.filtrosBusqueda.tipoProgramaSeleccionado.nValor, vm.prospectoSeleccionado.tipoDocumento.nValor, vm.prospectoSeleccionado.cDocumento)
                .then(
                    function onSuccess(respuesta) {

                        vm.prospectoSeleccionado.codEstadoValidacionDocumento = appConst.estadoValidacionDocumento.VALIDO;;

                    },
                    function onError(error) {

                        utilService.mostrarMensajeError(error);
                        vm.prospectoSeleccionado.codEstadoValidacionDocumento = appConst.estadoValidacionDocumento.RECHAZADO;;

                    })
                .finally(
                    function onFinally() {

                        document.getElementById('btnValidarDocumento').innerHTML = 'Validar';

                    }
                )

        }

        function validarFormatoNroDocumento() {

            switch (vm.prospectoSeleccionado.tipoDocumento.nValor) {

                case appConst.tipoDocumento.DNI:

                    if (vm.prospectoSeleccionado.cDocumento.length !== 8) {

                        vm.mensajeErrorFormatoNroDocumentoNoValido = 'Debe ser 8 caracteres';
                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', false);

                    } else {

                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', true);

                    }

                    break;

                case appConst.tipoDocumento.CEDULA_IDENTIDAD:

                    if (vm.prospectoSeleccionado.cDocumento.length < 5) {

                        vm.mensajeErrorFormatoNroDocumentoNoValido = 'Debe ser 5 a 12 caracteres';
                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', false);

                    } else {

                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', true);

                    }

                    break;

                default:

                    if (vm.prospectoSeleccionado.cDocumento.length !== 9) {

                        vm.mensajeErrorFormatoNroDocumentoNoValido = 'Debe ser 9 caracteres';
                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', false);

                    } else {

                        vm.formularioMantenimientoProspecto.txtNroDocumento.$setValidity('format', true);

                    }

                    break;
            }
        }

        function onInputNroDocumentoChanged() {

            if (vm.formularioMantenimientoProspecto.txtNroDocumento.$error.format) validarFormatoNroDocumento();
            vm.prospectoSeleccionado.codEstadoValidacionDocumento = appConst.estadoValidacionDocumento.PENDIENTE;

        }

        function onSelectTipoProgramaChanged(frmBusquedaProspectos) {

            vm.codVendedor = obtenerCodVendedorPorPrograma(vm.filtrosBusqueda.tipoProgramaSeleccionado.nValor);
            listarProspectos(false);

        }

        function obtenerCodVendedorPorPrograma(codTipoPrograma) {

            return vm.listaVendedores.find(v => v.nTipoProgramaVendedor === parseInt(codTipoPrograma)).nCodVen;

        }

    }

})();