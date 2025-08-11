export interface Paciente {
  id_paciente: string;
  nombre_completo: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  identificacion: string;
  tipoDocumento: string;
  documento: string;
  protocolo_actual: '' | string;
  tratamiento: string | null;
  medico_tratante: string;
  especialidad: string;
  codigoMedicoTratante: string;
  codigoEspecialidad: number;
  CIE11Descripcion: string;
  CIE11: string;
  peso: string;
  altura: string;
  tfg: string;
  eps: string;
  imc: number;
  superficie_corporal: number;
  fecha_consulta: string;
  fuente_datos: string;
}


export interface PacienteResponse {
  success: boolean;
  data: Paciente;
}
