import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { DataProvider } from './../../providers/data/data';

declare let Chart: any;
/**
 * Generated class for the StatsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'stats',
  templateUrl: 'stats.html'
})
export class StatsComponent implements AfterViewInit {
  @ViewChild('myChart') myChart: ElementRef;
  @ViewChild('myChart2') myChart2: ElementRef;
  @ViewChild('myChart3') myChart3: ElementRef;
  @ViewChild('myChart4') myChart4: ElementRef;
  recettesByMonth: any[] = [];
  clientsByMonth: any[] = [];
  clientsStatsByMonth: any[] = [];
  tontinesByMonth: any[] = [];
  constructor(private dataProvider: DataProvider) { }

  ngAfterViewInit() {
    let recettes = this.dataProvider.userData.RECETTES || [];
    let date;

    let byMonth = {};
    recettes.forEach((recette) => {
      date = new Date(recette.date);
      date = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!byMonth[date]) byMonth[date] = [];
      byMonth[date].push(recette);
    });
    let labels = [], recettesByMonth = [];
    let montant = 0;
    for (const key in byMonth) {
      labels.push(key);
      montant = 0;
      byMonth[key].forEach(element => {
        montant += +element.montant || 0;
      });
      recettesByMonth.push(montant);
    }
    setTimeout(() => {
      this.recettesByMonth = recettesByMonth;
      this.buildChart(this.myChart.nativeElement, 'line', 'Nombre de recettes/mois', labels, this.recettesByMonth);
    }, 0);
    let clients = this.dataProvider.userData.clientsMap || {};
    let byMonth2 = {}, byMonth4 = {};
    let profession;
    for (const key in clients) {
      date = new Date(clients[key].date);
      date = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!byMonth2[date]) byMonth2[date] = [];
      byMonth2[date].push(clients[key]);
      profession = clients[key].profession;
      if (!byMonth4[profession]) byMonth4[profession] = [];
      byMonth4[profession].push(clients[key]);
    }
    let labels2 = [], clientsByMonth = [], clientsStatsByMonth = [], labels4 = [];
    for (const key in byMonth2) {
      labels2.push(key);
      clientsByMonth.push(byMonth2[key].length);
    }
    for (const key in byMonth4) {
      labels4.push(key);
      clientsStatsByMonth.push(byMonth4[key].length);
    }
    setTimeout(() => {
      this.clientsByMonth = clientsByMonth;
      this.buildChart(this.myChart2.nativeElement, 'line', 'Nombre de clients/mois', labels2, this.clientsByMonth);
      this.clientsStatsByMonth = clientsStatsByMonth;
      this.buildChart(this.myChart4.nativeElement, 'line', 'Statistiques adhérants', labels4, this.clientsStatsByMonth);
    }, 0);
    //
    let tontines = this.dataProvider.userData.TONTINE || [];
    let byMonth3 = {};
    tontines.forEach((compte) => {
      date = compte.montantSouscritTontine;
      if (!byMonth3[date]) byMonth3[date] = [];
      byMonth3[date].push(compte);
    });
    let labels3 = [], tontinesByMonth = [];
    for (const key in byMonth3) {
      labels3.push(key);
      tontinesByMonth.push(byMonth3[key].length);
    }
    setTimeout(() => {
      this.tontinesByMonth = tontinesByMonth;
      this.buildChart(this.myChart3.nativeElement, 'line', 'Categorie de montant souscrit', labels3, this.tontinesByMonth);
    }, 0);
  }

  private buildChart(el: any, type: string, label: string, labels: string[], data) {
    try {
      let ctx = el.getContext('2d');
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: `# ${label}`,
            data: data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
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
