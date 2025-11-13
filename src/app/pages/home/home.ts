import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  isLoading = false;
  uploadMessage = '';
  isError = false;

  featureCards = [
    {
      icon: 'person-badge',
      title: 'Registrar Paciente',
      text: 'Carga los datos de un nuevo caso para su análisis clínico.',
      link: '/history'
    },
    {
      icon: 'activity',
      title: 'Ver Resultados',
      text: 'Consulta los análisis previos y reportes generados.',
      link: '/results'
    },
    {
      icon: 'bar-chart-line',
      title: 'Dashboard',
      text: 'Visualiza estadísticas e indicadores de predicción.',
      link: '/dashboard'
    }
  ];

  constructor(private http: HttpClient) { }

  onFileSelectedAndUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.uploadMessage = 'Por favor selecciona una imagen.';
      this.isError = true;
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);

    this.isLoading = true;
    this.uploadMessage = '';

    // 🔹 Simulación de análisis
    setTimeout(() => {
      this.isLoading = false;
      this.uploadMessage = 'Análisis completado: No se detectaron anomalías.';
      this.isError = false;
    }, 2000);

    // 🔹 Si tuvieras un backend real:
    /*
    this.http.post('https://tu-api-ml.com/predict', formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.uploadMessage = `Resultado del análisis: ${res.result}`;
        this.isError = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.uploadMessage = 'Error al procesar la imagen.';
        this.isError = true;
      }
    });
    */
  }
}
