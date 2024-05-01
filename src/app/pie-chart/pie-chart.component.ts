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
    this.dataSubscription = this.transactionService.calculateConsumptionTotals(this.jwtService.getUserId())
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
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = Math.min(canvasWidth, canvasHeight) * 0.4;
    
      const fontSize = 16;
      context.font = `${fontSize}px Arial`;
    
      canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    
        for (let i = 0; i < chartValues.length; i++) {
          const sliceAngle = (2 * Math.PI * chartValues[i]) / totalValue;
          const label = chartLabels[i];
    
          context.fillStyle = chartColors[i];
          context.beginPath();
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
          context.closePath();
          context.fill();
    
          const labelAngle = startAngle + sliceAngle / 2;
          const labelRadius = radius * 0.7; // Distance of labels from the center
    
          const labelX = centerX + Math.cos(labelAngle) * labelRadius;
          const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    
          context.fillStyle = 'black';
          context.textAlign = 'center';
          context.fillText(label, labelX, labelY);
    
          startAngle += sliceAngle;
        }
      });
    
      for (let i = 0; i < chartValues.length; i++) {
        const sliceAngle = (2 * Math.PI * chartValues[i]) / totalValue;
        const label = chartLabels[i];
    
        context.fillStyle = chartColors[i];
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        context.closePath();
        context.fill();
    
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7; // Distance of labels from the center
    
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(label, labelX, labelY);
    
        startAngle += sliceAngle;
      }
    }
  }
}