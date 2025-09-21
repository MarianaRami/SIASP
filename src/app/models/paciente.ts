export interface PacienteResponseDto {
  idServinte: string;
  idPaciente: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  tipoDocumento: string;
  documento: string;
  fechaNacimiento: string;
  nombreCompleto: string;
  identificacion: string;

  protocoloActual: {
    id: string;
    nombreProtocolo: string;
    version: number;
    descripcion: string;
    numeroCiclo: string;
    duracionCiclo: string;
    necesitaExamenes: boolean;
    estado: string;
    fechaCreacion: string;
    medicamentos: {
      id: string;
      nombre: string;
      dosis: string;
      formula: string;
      dosisCalculada: string;
    }[];
    eventos: {
      dia: number;
      tipo: string;
      descripcion: string;
    }[];
    configuracionMedicamentos: {
      [dia: string]: string[];
    };
  } | null;

  tratamiento: string | null;
  tratamientoCodigo: number;
  tratamientoNombre: string | null;
  tratamientoTipo: string | null;

  medicoTratante: string;
  codigoMedicoTratante: number;
  codigoEspecialidad: number;
  nombreEspecialidad: string;
  especialidad: string;

  peso: number;
  talla: number;
  tfg: number;
  eps: string;
  imc: number;
  superficieCorporal: number;
  edad: number;

  estadoPaciente: string;
  fechaCreacion: string;

  telefono1: string;
  telefono2: string;
  email1: string;
  email2: string;
  nombreContacto: string;
  fuenteDatos: string;

  fechaConsulta: string;
  protocoloPacienteId: string;
  fechaRegistroProtocolo: string;
  estadoProtocoloPaciente: string;
  tipoProtocolo: string;
  razonTratamiento: string;

  CIE11: string;
  CIE11Descripcion: string;
}


// 📌 Esto es lo que ENVÍAS al backend al crear/guardar paciente
export interface PacienteNuevoDto {
  idServinte: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  tipoDocumento: string;
  documento: string;
  fechaNacimiento: string;
  nombreContacto: string;
  telefono1: string;
  email1: string;
  telefono2: string;
  email2: string;
  eps: string;
  estado: string;
  indicadores: {
    peso: number;
    altura: number;
    tfg: number;
    fecha: string;
  };
  idProtocolo: string;
  medicoTratante: string;
  codigoMedicoTratante: number;
  codigoEspecialidad: number;
  fechaConsulta: string;
  tipo: string;
  razonTratamiento: string;
  especialidad: string;
  CIE11Descripcion: string;
  CIE11: string;
  tratamiento: string;
  tipoTratamiento: string;
  codigoTratamiento: number;
  usuarioCreacion: string;
}

export interface PacienteResponse {
  success: boolean;
  data: PacienteResponseDto; 
}

export interface CreateProtocoloPacienteCompletoDto {
  idProtocolo: string;
  idPaciente: string;
  idServinte: string;
  usuarioCreacion: string | null;
  documento: string;
  tipoDocumento: string;
  fechaRegistroProtocolo: string; // ISO string
  estado: "activo" | "suspendido" | "finalizado";
  tipo: "ambulatorio" | "hospitalizado";
  razonTratamiento: "cambio_protocolo" | "nuevo" | "recaida" | "transferencia";
  fechaConsulta: string;
  CIE11Descripcion: string;
  CIE11: string;
  medicoTratante: string;
  codigoMedicoTratante: number;
  especialidad: string;
  codigoEspecialidad: number;
  //tratamiento: string;
  //tipoTratamiento: string;
  fechaFinProtocolo?: string;
  tipoFin?: "cancelado" | "cambio_protocolo" | "concluido" | "desistido";
}

export interface DescripcionCicloPacienteCompleto {
  nombreProtocolo: string;
  version: number;
  descripcion: string;
  fechaCreacion: string; // se envía como string en formato ISO
  numero_ciclos: number;
  usuarioCreacion?: string | null;
  eventos: any[]; // puedes tiparlo con tu EventoDto
  numeroCiclo: number;
  ciclos: any[]; // CicloDto
  configuracionMedicamentos: any[]; // ConfiguracionMedicamentosDto
  indicadores: any; // IndicadoresDto
  medicamentos: any[]; // MedicamentoDto
  fecha_consulta: string; // también como string ISO (yyyy-MM-dd)
  fecha_inicio_estimada?: string | null;
  conciliacionMedicamentos: boolean;
  presentaciones: any[]; // PresentacionDto
  idPaciente: string;
  idProtocoloPaciente: string;
}

export interface DescripcionCicloPacienteCompletoResponse {
  success: boolean;
  message: string;
  data: DescripcionCicloPacienteCompleto;
  estadisticas?: {
    totalEventos: number;
    eventosActivos: number;
    totalMedicamentos: number;
    totalPresentaciones: number;
    ciclosActivos: number;
  };
}