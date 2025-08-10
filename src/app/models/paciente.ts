export interface Paciente {
  id_paciente: string;
  nombre_completo: string;
  identificacion: string;
  protocolo_actual: '';
  tratamiento: string | null;
  medico_tratante: string;
  especialidad: string;
  peso: string;
  altura: string;
  tfg: string;
  eps: string;
  CIE11_descripcion: string;
  imc: number;
  superficie_corporal: number;
  fecha_consulta: string; // formato ISO (YYYY-MM-DD)
  fuente_datos: string;
}

export interface PacienteResponse {
  success: boolean;
  data: Paciente;
}
