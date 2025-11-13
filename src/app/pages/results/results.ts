import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../components/safe/safe-pipe';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results {
  analysisResult = {
    date: '12/11/2025',
    diagnosis: 'Sin anomalías detectadas',
    confidence: '98%',
    details: 'El modelo no ha identificado patrones asociados a lesiones malignas.'
  };

  // 🔹 Power BI embebido
  powerBIUrl = 'https://app.powerbi.com/view?r=TU-ENLACE-AQUI';
}
