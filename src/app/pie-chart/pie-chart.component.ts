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
  private consumptionsSubscription!: Subscription;
  consumptionsData!: Record<string, number>;
  private incomesSubscription!: Subscription;
  incomesData!: Record<string, number>;

  constructor(
    private transactionService: TransactionService,
    private jwtService: JwtService
  ) {}

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true }) canvas2!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.drawChart(this.canvas.nativeElement, this.consumptionsData);
    this.drawChart(this.canvas2.nativeElement, this.incomesData);
  }

  ngOnInit() {
    this.consumptionsSubscription = this.transactionService.calculateConsumptionTotals(this.jwtService.getUserId())
      .subscribe(
        (data: Record<string, number>) => {
          this.consumptionsData = data;
          this.drawChart(this.canvas.nativeElement, this.consumptionsData);
        },
        error => {
          console.error('Ошибка при получении информации:', error);
        }
      );
      
    this.incomesSubscription = this.transactionService.calculateIncomeTotals(this.jwtService.getUserId())
      .subscribe(
        (data: Record<string, number>) => {
          this.incomesData = data;
          this.drawChart(this.canvas2.nativeElement, this.incomesData);
        },
        error => {
          console.error('Ошибка при получении информации:', error);
        }
      );
  }

  ngOnDestroy() {
    if (this.consumptionsSubscription) {
      this.consumptionsSubscription.unsubscribe();
    }
    if (this.incomesSubscription) {
      this.incomesSubscription.unsubscribe();
    }
  }

  drawChart(canvas: HTMLCanvasElement, chartData: Record<string, number>) {
    const context = canvas.getContext('2d');
    
    if (context && chartData) {
      const chartColors = [
        'rgba(31, 119, 180, 0.5)',   
        'rgba(255, 127, 14, 0.5)',   
        'rgba(44, 160, 44, 0.5)',     
        'rgba(214, 39, 40, 0.5)',     
        'rgba(148, 103, 189, 0.5)',   
        'rgba(140, 86, 75, 0.5)',     
        'rgba(227, 119, 194, 0.5)',   
        'rgba(127, 127, 127, 0.5)',   
        'rgba(188, 189, 34, 0.5)',    
        'rgba(23, 190, 207, 0.5)',    
        'rgba(174, 199, 232, 0.5)',   
        'rgba(255, 187, 120, 0.5)'
      ];
      const chartLabels = Object.keys(chartData);
      const chartValues = Object.values(chartData);
    
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
          const labelRadius = radius * 0.7;
    
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
        const labelRadius = radius * 0.7;
    
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(label, labelX, labelY);
    
        startAngle += sliceAngle;
      }
    }
  }

  calculatePercentage(value: number, data: Record<string, number>): number {
    const totalValue = Object.values(data).reduce((a, b) => a + b, 0);
    return (value / totalValue) * 100;
  }
}