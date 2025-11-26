import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  isLoading = false;
  uploadMessage = '';
  isError = false;
  imagePreviewUrl: string | null = null;

  private apiBase = 'http://localhost:3000';
  private predictUrl = `${this.apiBase}/api/predict`;
  private historyUrl = `${this.apiBase}/api/history`;

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

  constructor(
    private http: HttpClient
  ) { }

  onFileSelectedAndUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.uploadMessage = 'Por favor selecciona una imagen.';
      this.isError = true;
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append('image', file);

    this.isLoading = true;
    this.uploadMessage = '';
    this.isError = false;

    this.http.post<any>(this.predictUrl, formData).subscribe({
      next: (res) => {
        let prediction: any = null;

        if (res.result?.displayNames && res.result?.confidences) {
          prediction = res.result;
        } else if (res.predictions?.[0]?.displayNames && res.predictions?.[0]?.confidences) {
          prediction = res.predictions[0];
        }

        if (prediction) {
          const labels: string[] = prediction.displayNames;
          const confidences: number[] = prediction.confidences;

          // Tomamos SOLO la mejor predicción (índice 0)
          const label = labels[0];
          const confidence = confidences[0];

          const labelTraducida = this.translateLabel(label);
          const porcentaje = (confidence * 100).toFixed(1);

          this.uploadMessage = `Diagnóstico sugerido: ${labelTraducida} (${porcentaje}% de confianza).`;
          this.isError = false;

          this.http.post(this.historyUrl, {
            date: new Date().toISOString().slice(0, 10),
            result: labelTraducida,
            confidence: `${porcentaje}%`
          }).subscribe({
            next: () => {
              console.log('Historial guardado en backend');
            },
            error: (err) => {
              console.error('Error guardando historial:', err);
            }
          });
        } else {
          this.uploadMessage = 'No se pudo interpretar la respuesta del modelo.';
          this.isError = true;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.uploadMessage = 'Error al procesar la imagen en el servidor.';
        if (err.error?.error) {
          this.uploadMessage += ` Detalle: ${err.error.error}`;
        } else if (err.error?.details) {
          this.uploadMessage += ` Detalle: ${err.error.details}`;
        }
        this.isError = true;
        this.isLoading = false;
      }
    });
  }
  private translateLabel(label: string): string {
    const map: Record<string, string> = {
      nv: 'Nevus melanocítico (lunar benigno)',
      mel: 'Melanoma (lesión maligna sospechosa)',
      bkl: 'Lesión queratinocítica benigna',
      akiec: 'Carcinoma intraepidérmico',
      bcc: 'Carcinoma basocelular',
      df: 'Dermatofibroma',
      vasc: 'Lesión vascular'
    };

    return map[label] || label;
  }
}
