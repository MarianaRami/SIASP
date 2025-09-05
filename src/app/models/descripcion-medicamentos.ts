export interface DescripcionMedicamentoParaPresentacionDto {
  nombre: string;
  dosisFormulada: number;
  formula: string;
  dosisTeorica: number
}

export interface MedicamentoPresentacionResponse {
  success: boolean;
  resultados: ResultadoMedicamento[];
}

export interface ResultadoMedicamento {
  nombre: string;
  data: MedicamentoData;
}

export interface MedicamentoData {
  nombre: string;
  dosisTeorica: number;
  success: boolean;
  medicamentoId: string;
  nombreMedicamento: string;
  unidadBase: string;
  dosisBase: number;
  dosisRequerida: number;
  dosisTotal: number;
  sobrante: number;
  porcentajeSobrante: string;
  combinacionOptima: CombinacionOptima[];
}

export interface CombinacionOptima {
  presentacionId: string;
  nombre: string;
  cantidad: number;
  concentracion: number;
  unidad: string;
  dosisAportada: number;
}
