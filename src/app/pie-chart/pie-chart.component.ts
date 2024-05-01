import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransactionService } from '../services/transaction.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styles: []
})
export class PieChartComponent implements OnInit {
  private dataSubscription!: Subscription;
  chartData!: Record<string, number>;

  constructor(
    private transactionService: TransactionService,
    private jwtService: JwtService
  ) {}

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const context = this.canvas.nativeElement.getContext('2d');
    
    this.drawChart();
  }

  ngOnInit() {
    this.dataSubscription = this.transactionService.calculateTotals(this.jwtService.getUserId())
      .subscribe(
        (data: Record<string, number>) => {
          this.chartData = data;
          this.drawChart();
        },
        error => {
          console.error('Ошибка при получении информации:', error);
        }
      );
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  drawChart() {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
  
    if (context && this.chartData) {
      const chartColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
      const chartLabels = Object.keys(this.chartData);
      const chartValues = Object.values(this.chartData);
  
      const totalValue = chartValues.reduce((a, b) => a + b, 0);
      let startAngle = 0;
  
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      const fontSize = 16;
      context.font = `${fontSize}px Arial`;
  
      canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        context.clearRect(0, 0, canvasWidth, canvasHeight); // Очистка canvas перед перерисовкой
  
        for (let i = 0; i < chartValues.length; i++) {
          const sliceAngle = (2 * Math.PI * chartValues[i]) / totalValue;
          const label = chartLabels[i];
  
          context.fillStyle = chartColors[i];
          context.beginPath();
          context.moveTo(canvasWidth / 2, canvasHeight / 2);
          context.arc(
            canvasWidth / 2,
            canvasHeight / 2,
            Math.min(canvasWidth, canvasHeight) / 2,
            startAngle,
            startAngle + sliceAngle
          );
          context.closePath();
          context.fill();
  
          const labelAngle = startAngle + sliceAngle / 2;
  
          const radius = Math.min(canvasWidth, canvasHeight) / 2.5;
          const labelX = (canvasWidth / 2) + Math.cos(labelAngle) * radius;
          const labelY = (canvasHeight / 2) + Math.sin(labelAngle) * radius;
  
          context.fillStyle = 'black';
          context.textAlign = 'center';
  
          if (context.isPointInPath(x, y)) {
            const percentage = (chartValues[i] / totalValue) * 100;
            context.fillText(`${percentage.toFixed(1)}%`, labelX, labelY - fontSize);
          } else {
            context.fillText(label, labelX, labelY);
          }
  
          startAngle += sliceAngle;
        }
      });
  
      // Инициализация диаграммы
      for (let i = 0; i < chartValues.length; i++) {
        const sliceAngle = (2 * Math.PI * chartValues[i]) / totalValue;
        const label = chartLabels[i];
  
        context.fillStyle = chartColors[i];
        context.beginPath();
        context.moveTo(canvasWidth / 2, canvasHeight / 2);
        context.arc(
          canvasWidth / 2,
          canvasHeight / 2,
          Math.min(canvasWidth, canvasHeight) / 2,
          startAngle,
          startAngle + sliceAngle
        );
        context.closePath();
        context.fill();
  
        const labelAngle = startAngle + sliceAngle / 2;

        // Измерение ширины текста
        const labelWidth = context.measureText(label).width;

        // Расчет позиции текста
        const radius = Math.min(canvasWidth, canvasHeight) / 2.5;
        const labelX = (canvasWidth / 2) + Math.cos(labelAngle) * radius;
        const labelY = (canvasHeight / 2) + Math.sin(labelAngle) * radius;

        // Проверка, выходит ли текст за пределы сегмента
        if (labelX + labelWidth / 2 > canvasWidth) {
          context.textAlign = 'right';
          context.fillText(label, canvasWidth, labelY);
        } else if (labelX - labelWidth / 2 < 0) {
          context.textAlign = 'left';
          context.fillText(label, 0, labelY);
        } else {
          context.textAlign = 'center';
          context.fillText(label, labelX, labelY);
        }
  
        context.fillStyle = 'black';
  
        startAngle += sliceAngle;
      }
    }
  }
}