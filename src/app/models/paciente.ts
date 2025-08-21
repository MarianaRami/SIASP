// 📌 Esto es lo que VIENE del backend al consultar paciente
export interface PacienteResponseDto {
  idServinte: string;
  nombre_completo: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  documento: string;
  tipoDocumento: string;
  protocolo_actual: '' | string;
  tratamiento: string | null;
  medico_tratante: string;
  especialidad: string;
  codigoMedicoTratante: string;
  codigoEspecialidad: number;
  CIE11Descripcion: string;
  CIE11: string;
  peso: number;
  altura: number;
  tfg: number;
  eps: string;
  imc: number;
  superficie_corporal: number;
  fecha_consulta: string;
  telefono1: string;
  email1: string;
  telefono2: string;
  email2: string;
  fuente_datos: string;
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
  codigoTratamiento: number;
  usuarioCreacion: string;
}

export interface PacienteResponse {
  success: boolean;
  data: PacienteResponseDto; // 👈 OJO aquí
}
