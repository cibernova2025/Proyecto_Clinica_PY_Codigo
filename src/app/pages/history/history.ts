import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface HistoryItem {
  id?: string;
  date: string;
  result: string;
  confidence: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {
  analyses: HistoryItem[] = [];
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<HistoryItem[]>(`${this.apiBase}/api/history`)
      .subscribe({
        next: (data) => {
          this.analyses = data;
        },
        error: (err) => {
          console.error('Error cargando historial:', err);
        }
      });
  }
}