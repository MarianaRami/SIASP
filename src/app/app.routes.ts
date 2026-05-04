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
import { BorradoresComponent } from './views/QF/borradores/borradores.component';

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

import { ConfCicloComponent } from './views/admin-sistema/conf-ciclo/conf-ciclo.component';
import { ConfMedicamentosComponent } from './views/admin-sistema/conf-medicamentos/conf-medicamentos.component';
import { DatosNvProtocoloComponent } from './views/admin-sistema/datos-nv-protocolo/datos-nv-protocolo.component';
import { InfCicloComponent } from './views/admin-sistema/inf-ciclo/inf-ciclo.component';
import { InfMedicamentosComponent } from './views/admin-sistema/inf-medicamentos/inf-medicamentos.component';
import { ProtocolosComponent } from './views/admin-sistema/protocolos/protocolos.component';
import { InfProtocoloComponent } from './views/admin-sistema/inf-protocolo/inf-protocolo.component';
import { roleGuard } from './guards/role.guard';

import { Inicio } from './pages/inicio/inicio.component';

// roles: Admin, Jefe_Enfermeria, Jefe_Piso, Director_Farmacia, Farmacia, Enfermeria, QF, Programacion, Autorizaciones, Doctora
export const routes: Routes = [
  { path: 'inicio', component: Inicio },

  { path: 'examenes', component: ExamenesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'examenes'] } },

  { path: 'enfermeria', component: EnfermeriaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'enfermeria'] } },

  { path: 'jefe-enfermeria', component: JefeEnfermeriaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'jefe_enfermeria'] } },
  
  { path: 'admin-usuarios', component: AdministradorUsuariosComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  
  { path: 'indicadores', component: IndicadoresComponent, canActivate: [roleGuard], data: { roles: ['admin', 'indicadores'] } },

  { path:'jefe-piso', component: JefePisoComponent, canActivate: [roleGuard], data: { roles: ['admin', 'jefe_piso'] } },

  //Administrador Sistema
  { path: 'admin-sistema', component: AdministradorSistemaComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  
  { path: 'admin-sistema/Nuevo-protocolo/Conf-Ciclo', component: ConfCicloComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-sistema/Nuevo-protocolo/Conf-Ciclo/Conf-Medicamento', component: ConfMedicamentosComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-sistema/Nuevo-protocolo', component: DatosNvProtocoloComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-sistema/Protocolo/Info-Protocolo/Info-Ciclo', component: InfCicloComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-sistema/Protocolo/Info-Protocolo/Info-Ciclo/Info-Medicamentos', component: InfMedicamentosComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path:  'admin-sistema/Protocolo/Info-Protocolo', component: InfProtocoloComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-sistema/Protocolo/:id', component: ProtocolosComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },

  //Director Famacia
  { path: 'director-farmacia', component: DirectorFarmaciaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'director_farmacia'] } },
  
  // Farmacia
  { path: 'farmacia', component: FarmaciaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'farmacia'] } },

  { path: 'farmacia/farmacia', component: MedFarmaciaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'farmacia'] } },
  { path: 'farmacia/OP', component: OPComponent, canActivate: [roleGuard], data: { roles: ['admin', 'farmacia'] } },

  // Programación
  { path: 'programacion', component: ProgramacionComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },

  { path: 'programacion/busquedaPro', component: BusquedaProComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/confirmación', component: ConfirmacionComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/busquedaPro/historial/:cedula', component: HistorialComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/pendientesNotificacion', component: PendientesNotificacionComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/reprogramacion', component: ReprogramacionComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/busquedaPro/historial/:cedula/historial', component: HistorialPacienteComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/calendario', component: CalendarioPacientesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },
  { path: 'programacion/calendario/reporte/:date', component: ReporteCalendarioComponent, canActivate: [roleGuard], data: { roles: ['admin', 'programacion'] } },

  // Autorizaciones
  { path: 'autorizaciones', component: AutorizacionesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'autorizaciones'] } },

  { path: 'autorizaciones/busquedaAU', component: BusquedaAUComponent, canActivate: [roleGuard], data: { roles: ['admin', 'autorizaciones'] } },
  { path: 'autorizaciones/busquedaAU/Autorizacion/:cedula', component: AutorizacionComponent, canActivate: [roleGuard], data: { roles: ['admin', 'autorizaciones'] } },
  { path: 'autorizaciones/Pacientes', component: PacientesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'autorizaciones'] } },

  // QF
  { path: 'qf', component: QfComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },

  { path: 'qf/indicadores', component: BorradoresComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] }  },
  { path: 'qf/busqueda', component: BusquedaComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },
  { path: 'qf/observaciones', component: ObservacionesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },
  { path: 'qf/observaciones/medicamentos', component: PopUpObvMedicamentosComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },
  { path: 'qf/busqueda/paciente/:cedula', component: PacienteComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },
  { path: 'qf/busqueda/paciente/:cedula/conf-ciclo' , component: ConfiguracionCicloComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },
  { path: 'qf/busqueda/paciente/:cedula/conf-ciclo/conf-aplicaciones', component: ConfiguracionAplicacionesComponent, canActivate: [roleGuard], data: { roles: ['admin', 'qf'] } },

  { path: '', component: LoginComponent }, 
];

