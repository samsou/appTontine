import { Component, ElementRef, ViewChild } from '@angular/core';

import { DataProvider } from '../../providers/data/data';
import { UserData } from './../../providers/data/userdata';

declare let Chart: any;
/**
 * Generated class for the BoardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {
  @ViewChild('myChart') myChart: ElementRef;
  @ViewChild('myChart2') myChart2: ElementRef;
  @ViewChild('myChart3') myChart3: ElementRef;
  @ViewChild('myChart4') myChart4: ElementRef;
  constructor(public dataProvider: DataProvider) {
  }
  ngAfterViewInit() {
    let labels: string[] = [];
    let months: string[] = UserData.getInstance().months;
    var today = new Date();
    var d;

    for (let i = 6; i > 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() + 1 - i, 1);
      labels.push(months[d.getMonth()]);
    }

    this.buildChart(this.myChart.nativeElement, 'line', 'Nombre de clients/mois', labels);
    this.buildChart(this.myChart2.nativeElement, 'polarArea', 'Tontine', labels);
    this.buildChart(this.myChart3.nativeElement, 'pie', 'Epargne', labels);
    this.buildChart(this.myChart4.nativeElement, 'bar', 'Rapport journalier', labels);
  }
  private buildChart(el: any, type: string, label: string, labels: string[]) {
    try {
      let ctx = el.getContext('2d');
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: `# ${label}`,
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    } catch (e) { }
  }
}
