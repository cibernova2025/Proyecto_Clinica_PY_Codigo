import { Injectable } from '@angular/core';

export interface AnalysisItem {
  date: string;      // ej: 2025-11-25
  result: string;    // texto traducido del modelo
  confidence: string; // ej: "92.6%"
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisHistoryService {
  private _analyses: AnalysisItem[] = [];

  // Devolvemos una copia para no mutar el arreglo directo
  get analyses(): AnalysisItem[] {
    // opcional: orden inverso para mostrar el más reciente arriba
    return [...this._analyses].reverse();
  }

  addAnalysis(item: AnalysisItem) {
    this._analyses.push(item);
  }

  clear() {
    this._analyses = [];
  }
}