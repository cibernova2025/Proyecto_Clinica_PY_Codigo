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

  // 🔹 Datos para el gráfico de barras
  results: { label: string; translatedLabel: string; confidencePct: number }[] = [];

  private apiBase = 'http://localhost:3000';
  private predictUrl = `${this.apiBase}/api/predict`;
  private historyUrl = `${this.apiBase}/api/history`;

  featureCards = [
    {
      icon: 'person-badge',
      title: 'Historial Clínico',
      text: 'Visualiza los análisis anteriores y su evolución en el tiempo.',
      link: '/history'
    },
    {
      icon: 'activity',
      title: 'Ver Resultados',
      text: 'Consulta los análisis previos y reportes generados.',
      link: '/results'
    },
  ];

  constructor(
    private http: HttpClient
  ) { }

  onFileSelectedAndUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.uploadMessage = 'Por favor selecciona una imagen.';
      this.isError = true;
      this.results = [];
      this.imagePreviewUrl = null;
      return;
    }

    const file = input.files[0];

    // 🔹 Preview de la imagen
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
    this.results = [];

    this.http.post<any>(this.predictUrl, formData).subscribe({
      next: (res) => {
        this.isLoading = false;

        // ⬇️ Usamos lo que devuelve tu backend: labels y confidences
        const labels: string[] = res.labels || [];
        const confidences: number[] = res.confidences || [];

        if (!labels.length || !confidences.length) {
          this.uploadMessage = 'No se pudo interpretar la respuesta del modelo.';
          this.isError = true;
          this.results = [];
          return;
        }

        // 🔹 Llenamos todas las predicciones para el gráfico
        this.results = labels.map((label, index) => {
          const confidence = confidences[index] ?? 0;
          const confidencePct = Math.round(confidence * 1000) / 10; // 1 decimal
          const translatedLabel = this.translateLabel(label);

          return {
            label,
            translatedLabel,
            confidencePct
          };
        });
        this.results.sort((a, b) => b.confidencePct - a.confidencePct);

        // 🔹 Tomamos la mejor predicción (la primera) para el mensaje principal e historial
        const top = this.results[0];
        this.uploadMessage =
          `Diagnóstico principal sugerido: ${top.translatedLabel} (${top.confidencePct}% de confianza).`;
        this.isError = false;

        // 🔹 Guardar en historial solo el TOP 1
        this.http.post(this.historyUrl, {
          date: new Date().toISOString().slice(0, 10),
          result: top.translatedLabel,
          confidence: `${top.confidencePct}%`
        }).subscribe({
          next: () => {
            console.log('Historial guardado en backend');
          },
          error: (err) => {
            console.error('Error guardando historial:', err);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.uploadMessage = 'Error al procesar la imagen en el servidor.';
        if (err.error?.error) {
          this.uploadMessage += ` Detalle: ${err.error.error}`;
        } else if (err.error?.details) {
          this.uploadMessage += ` Detalle: ${err.error.details}`;
        }
        this.isError = true;
        this.results = [];
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