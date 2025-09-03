export interface Medicamento {
  nombre: string;
  dosis: string;
  formula: string;
}

export interface Evento {
  dia: string;
  evento: string;
  observacion: string;
  activo: boolean;
}

export interface ConfiguracionMedicamento {
  dia: string;
  medicamentos: {
    nombre: string;
    dosis: number
  };
}

export interface Protocolo {
  nombreProtocolo: string;
  version: number;
  fechaCreacion: string; // ISO string
  usuarioCreacion: string;
  medicamentos: Medicamento[];
  numeroCiclo: string;
  duracionCiclo: string;
  necesitaExamenes: boolean;
  eventos: Evento[];
  configuracionMedicamentos: ConfiguracionMedicamento[];
  oncologico: boolean;
  observaciones: string;
  estado: string;
  id: string;
}

export interface ProtocoloCreate {
  nombreProtocolo: string;
  usuarioCreacion: string;
  medicamentos: Medicamento[];
  numeroCiclo: string;
  duracionCiclo: string;
  necesitaExamenes: boolean;
  eventos: Evento[];
  configuracionMedicamentos: ConfiguracionMedicamento[];
}