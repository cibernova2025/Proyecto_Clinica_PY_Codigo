import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History {
  // Simulación de historial de análisis
  analyses = [
    { date: '2025-11-12', result: 'Sin anomalías detectadas', confidence: '98%' },
    { date: '2025-11-10', result: 'Posible lesión benigna', confidence: '85%' },
    { date: '2025-11-08', result: 'Imagen poco clara — repetir análisis', confidence: '60%' }
  ];
}
