export interface MedicamentoParaPresentacionDto {
  idCiclo?: string;
  medicamentos: MedicamentoDto[];
  diaConfiguracionMedicamentos: DiaConfiguracionDto[];
}

export interface MedicamentoDto {
  nombre: string;
  dosisFormulada: number;
  formula: string;
  dosisTeorica: number;
}

export interface DiaConfiguracionDto {
  dia: number;
  medicamentos: MedicamentoDiaDto[];
}

export interface MedicamentoDiaDto {
  nombre: string;
  dosisTeorica: number;
}

export interface MedicamentoPresentacionResponse {
  success: boolean;
  resultados: ResultadoMedicamento[];
}

export interface ResultadoMedicamento {
  nombre: string;
  dosisTeorica: number;
  presentaciones: CombinacionOptima;
}

export interface CombinacionOptima {
  nombrePresentacion: string;
  dosisTotal: number;
  cantidadPorAplicacion: number;
  dosisAportadaPorAplicacion: number;
  cantidadPorCiclo: number;
  dosisAportadaPorCiclo: number;
}
