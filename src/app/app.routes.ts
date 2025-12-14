import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { AutorizacionesComponent } from './pages/autorizaciones/autorizaciones.component';
import { EnfermeriaComponent } from './pages/enfermeria/enfermeria.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { FarmaciaComponent } from './pages/farmacia/farmacia.component';
import { JefeEnfermeriaComponent } from './pages/jefe-enfermeria/jefe-enfermeria.component';
import { ProgramacionComponent } from './pages/programacion/programacion.component';
import { QfComponent } from './pages/qf/qf.component';
import { DirectorFarmaciaComponent } from './pages/director-farmacia/director-farmacia.component';
import { AdministradorSistemaComponent } from './pages/administrador-sistema/administrador-sistema.component';
import { AdministradorUsuariosComponent } from './pages/administrador-usuarios/administrador-usuarios.component';
import { IndicadoresComponent } from './pages/indicadores/indicadores.component';
import { JefePisoComponent } from './pages/jefe-piso/jefe-piso.component';

import { BusquedaComponent } from './views/QF/busqueda/busqueda.component';
import { ObservacionesComponent } from './views/QF/observaciones/observaciones.component';
import { PacienteComponent } from './views/QF/paciente/paciente.component';
import { ConfiguracionCicloComponent } from './views/QF/configuracion-ciclo/configuracion-ciclo.component';
import { PopUpObvMedicamentosComponent } from './views/QF/pop-up-obv-medicamentos/pop-up-obv-medicamentos.component';
import { ConfiguracionAplicacionesComponent } from './views/QF/configuracion-aplicaciones/configuracion-aplicaciones.component';

import { BusquedaAUComponent } from './views/autorizaciones/busqueda-au/busqueda-au.component';
import { AutorizacionComponent } from './views/autorizaciones/autorizacion/autorizacion.component';
import { PacientesComponent } from './views/autorizaciones/pacientes/pacientes.component';

import { BusquedaProComponent } from './views/programación/busqueda-pro/busqueda-pro.component';
import { ConfirmacionComponent } from './views/programación/confirmacion/confirmacion.component';
import { HistorialComponent } from './views/programación/historial/historial.component';
import { PendientesNotificacionComponent } from './views/programación/pendientes-notificacion/pendientes-notificacion.component';
import { ReprogramacionComponent } from './views/programación/reprogramacion/reprogramacion.component';
import { HistorialPacienteComponent } from './views/programación/historial-paciente/historial-paciente.component';
import { CalendarioPacientesComponent } from './views/programación/calendario-pacientes/calendario-pacientes.component';
import { ReporteCalendarioComponent } from './views/programación/reporte-calendario/reporte-calendario.component';

import { MedFarmaciaComponent } from './views/farmacia/med-farmacia/med-farmacia.component';
import { OPComponent } from './views/farmacia/op/op.component';

import { ListaMedicamentosComponent } from './views/director-farmacia/lista-medicamentos/lista-medicamentos.component';

import { ConfCicloComponent } from './views/admin-sistema/conf-ciclo/conf-ciclo.component';
import { ConfMedicamentosComponent } from './views/admin-sistema/conf-medicamentos/conf-medicamentos.component';
import { DatosNvProtocoloComponent } from './views/admin-sistema/datos-nv-protocolo/datos-nv-protocolo.component';
import { InfCicloComponent } from './views/admin-sistema/inf-ciclo/inf-ciclo.component';
import { InfMedicamentosComponent } from './views/admin-sistema/inf-medicamentos/inf-medicamentos.component';
import { ProtocolosComponent } from './views/admin-sistema/protocolos/protocolos.component';
import { InfProtocoloComponent } from './views/admin-sistema/inf-protocolo/inf-protocolo.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // 🔓 LOGIN
  { path: '', component: LoginComponent },

  // 🔒 RUTAS PROTEGIDAS
  {
    path: '',
    canActivate: [AuthGuard],
    children: [

      { path: 'examenes', component: ExamenesComponent },
      { path: 'enfermeria', component: EnfermeriaComponent },
      { path: 'jefe-enfermeria', component: JefeEnfermeriaComponent },
      { path: 'admin-usuarios', component: AdministradorUsuariosComponent },
      { path: 'indicadores', component: IndicadoresComponent },
      { path:'jefe-piso', component: JefePisoComponent },

      // Administrador Sistema
      { path: 'admin-sistema', component: AdministradorSistemaComponent },
      { path: 'admin-sistema/Nuevo-protocolo', component: DatosNvProtocoloComponent },
      { path: 'admin-sistema/Nuevo-protocolo/Conf-Ciclo', component: ConfCicloComponent },
      { path: 'admin-sistema/Nuevo-protocolo/Conf-Ciclo/Conf-Medicamento', component: ConfMedicamentosComponent },

      { path: 'admin-sistema/Protocolo/:id', component: ProtocolosComponent },
      { path: 'admin-sistema/Protocolo/Info-Protocolo', component: InfProtocoloComponent },
      { path: 'admin-sistema/Protocolo/Info-Protocolo/Info-Ciclo', component: InfCicloComponent },
      { path: 'admin-sistema/Protocolo/Info-Protocolo/Info-Ciclo/Info-Medicamentos', component: InfMedicamentosComponent },

      // Director Farmacia
      { path: 'director-farmacia', component: DirectorFarmaciaComponent },
      { path: 'director-farmacia/lista', component: ListaMedicamentosComponent },

      // Farmacia
      { path: 'farmacia', component: FarmaciaComponent },
      { path: 'farmacia/farmacia', component: MedFarmaciaComponent },
      { path: 'farmacia/OP', component: OPComponent },

      // Programación
      { path: 'programacion', component: ProgramacionComponent },
      { path: 'programacion/busquedaPro', component: BusquedaProComponent },
      { path: 'programacion/confirmación', component: ConfirmacionComponent },
      { path: 'programacion/busquedaPro/historial/:cedula', component: HistorialComponent },
      { path: 'programacion/pendientesNotificacion', component: PendientesNotificacionComponent },
      { path: 'programacion/reprogramacion', component: ReprogramacionComponent },
      { path: 'programacion/busquedaPro/historial/:cedula/historial', component: HistorialPacienteComponent },
      { path: 'programacion/calendario', component: CalendarioPacientesComponent },
      { path: 'programacion/calendario/reporte/:date', component: ReporteCalendarioComponent },

      // Autorizaciones
      { path: 'autorizaciones', component: AutorizacionesComponent },
      { path: 'autorizaciones/busquedaAU', component: BusquedaAUComponent },
      { path: 'autorizaciones/busquedaAU/Autorizacion/:cedula', component: AutorizacionComponent },
      { path: 'autorizaciones/Pacientes', component: PacientesComponent },

      // QF
      { path: 'qf', component: QfComponent },
      { path: 'qf/busqueda', component: BusquedaComponent },
      { path: 'qf/observaciones', component: ObservacionesComponent },
      { path: 'qf/observaciones/medicamentos', component: PopUpObvMedicamentosComponent },
      { path: 'qf/busqueda/paciente/:cedula', component: PacienteComponent },
      { path: 'qf/busqueda/paciente/:cedula/conf-ciclo', component: ConfiguracionCicloComponent },
      { path: 'qf/busqueda/paciente/:cedula/conf-ciclo/conf-aplicaciones', component: ConfiguracionAplicacionesComponent }

    ]
  }
];


