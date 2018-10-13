import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { Client, Compte, Produit } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';

declare let pdfMake: any
/**
 * Generated class for the AuditsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'audits',
  templateUrl: 'audits.html'
})
export class AuditsComponent {
  model: any = {
    entity: '',
    filtre: ''
  };
  filtres: any[];
  @ViewChild('iframe') iframe: any;
  date1: any;
  date2: any;
  produits: any[] = [];
  clients: any[] = [];
  recettes: any[] = [];
  tontines: Compte[] = [];
  epargnes: Compte[] = [];

  constructor(private dataProvider: DataProvider, private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
  }
  ngAfterViewInit() {
    this.getProduits();
    this.getClients();
    this.getRecettes();
    this.getComptes('EPARGNE');
    this.getComptes('TONTINE');
  }
  getComptes(type) {
    this.dataProvider.getComptes(type).subscribe((comptes: Compte[]) => {
      comptes = comptes || [];
      let cptes = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        compte.produit = this.dataProvider.getProduitById(compte.idProduit);
        //this.montantTotalEpargne += +compte.montant || 0;
        return compte;
      });
      if (type === 'EPARGNE') {
        this.epargnes = cptes;
      } else if (type === 'TONTINE') {
        this.tontines = cptes;
      }
    }, (err) => {
    });
  }
  getRecettes() {
    this.recettes = this.dataProvider.userData.RECETTES;
    this.dataProvider.getComptes('RECETTES').subscribe((recettes: any[]) => {
      this.recettes = recettes;
      /* this.recettes.forEach((rec) => {
        this.montant += +rec.montant;
      }); */
    }, (err) => {
    });
  }
  getClients() {
    this.dataProvider.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    }, (err) => {
    });
  }
  getProduits() {
    this.dataProvider.getProduits().subscribe((produits: Produit[]) => {
      this.produits = produits;
    }, (err) => {
    });
  }
  onEntityChange() {
    this.model.filtre = "";
    this.filtres = [];
    if (this.model.entity === 'produit') {
      this.filtres = [
        {
          libelle: 'Tous les produits',
          code: 'ALL_PRODUIT'
        },
        {
          libelle: 'Les produits Epargnes',
          code: 'EPARGNE_PRODUIT'
        },
        {
          libelle: 'Les produits Tontines',
          code: 'TONTINE_PRODUIT'
        }
      ];
    } else if (this.model.entity === 'client') {
      this.filtres = [
        {
          libelle: 'Tous les clients',
          code: 'ALL_CLIENT'
        },
        /*  {
           libelle: 'Les clients qui ont un compte epargne et tontine',
           code: 'CLIENT_ALL_COMPTES'
         } */
      ];
    } else if (this.model.entity === 'comptes') {
      this.filtres = [
        {
          libelle: 'Tous les comptes',
          code: 'ALL_COMPTE'
        },
        {
          libelle: 'Les comptes tontines',
          code: 'TONTINE_COMPTE'
        },
        {
          libelle: 'Les comptes epargnes',
          code: 'EPARGNE_COMPTE'
        }
      ];
    } else if (this.model.entity === 'recette') {
      this.filtres = [
        {
          libelle: 'Toutes nos recettes',
          code: 'ALL_RECETTE'
        },
        /* {
          libelle: 'Les recettes entre',
          code: 'RECETTE_INTERVAL'
        } */
      ];
    }
  }
  onFiltreChange() {
    if (this.model.filtre === 'RECETTE_INTERVAL') {

    }
    if (this.model.filtre)
      this.buildEtat();
  }
  private getTitle() {
    if (this.model.filtre === 'ALL_PRODUIT') {
      return "Les produits";
    } else if (this.model.filtre === 'EPARGNE_PRODUIT') {
      return "Les produits epargnes";
    } else if (this.model.filtre === 'TONTINE_PRODUIT') {
      return "Les produits tontines";
    } else if (this.model.filtre === 'ALL_CLIENT') {
      return "Les clients";
    } else if (this.model.filtre === 'CLIENT_ALL_COMPTES') {
      return "Les clients ayant un compte tontine & epargne";
    } else if (this.model.filtre === 'ALL_COMPTE') {
      return "Les comptes";
    } else if (this.model.filtre === 'TONTINE_COMPTE') {
      return "Les comptes tontines";
    } else if (this.model.filtre === 'EPARGNE_COMPTE') {
      return "Les comptes epargnes";
    } else if (this.model.filtre === 'ALL_RECETTE') {
      return "Les recettes";
    } else if (this.model.filtre === 'RECETTE_INTERVAL') {
      return `Les recettes du ${this.date1} au ${this.date2}`;
    }
    return '';
  }
  private buildEtat() {
    let data: any = this.buildBody();
    let pageOrientation;
    if (this.model.entity === 'client')
      pageOrientation = 'landscape'
    let dd = {
      pageOrientation,
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + ' of ' + pageCount,
          style: 'footer'
        };
      },
      content: [
        {
          text: "CABFA MICROFINANCE",
          style: 'head'
        },
        {
          background: '#b45c5c',
          alignment: 'center',
          width: '*',
          height: 0.2,
          margin: [10, 5, 10, 5],
          text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'
        },
        {
          alignment: 'center',
          text: this.getTitle().toUpperCase(),
          style: 'title'
        },
        {
          style: 'dataTable',
          table: {
            widths: data.widths,
            body: data.body
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0;
            },
            vLineWidth: function (i, node) {
              //if (i == 0) return 1;
              return i == 0 || i == node.table.widths.length ? 0 : 1;
            },
            vLineColor: (i, node) => '#fff',
            fillColor: function (i, node) {
              if (i == 0) return 'blue';
              return (i % 2 === 0) ? '#afced7' : null;
            }
          }
        }
      ],
      styles: {
        head: {
          alignment: 'right',
          color: '#e83737',
          bold: true,
          fontSize: 18,
          margin: [5, 5, 5, 10]
        },
        footer: {
          alignment: 'center',
          italics: true
        },
        dataTable: {
          margin: [0, 2, 10, 5]
        },
        titleTable: {
          alignment: 'center'
        },
        title: {
          alignment: 'center',
          fontSize: 17,
          bold: true,
          padding: [10, 5, 10, 5],
          margin: [5, 10, 5, 14]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "white"
        },
        counter: {
          italics: true,
          fonSize: 8,
          padding: [1, 2, 1, 3]
        }
      }
    };
    let pdf = pdfMake.createPdf(dd);
    //pdf.download(`releve-${name}.pdf`);
    pdf.getDataUrl((data) => {
      if (data) {
        const iframe: HTMLIFrameElement = this.iframe.nativeElement;
        iframe.src = data;
      }
    });
  }
  private buildBody() {
    let data = {
      body: [],
      widths: undefined
    };
    let tt = this._buildTableTitle() || [];
    if (['EPARGNE_PRODUIT', 'EPARGNE_COMPTE'].indexOf(this.model.filtre) !== -1) {
      data.widths = tt.map((value, index) => {
        if (index === 0) return 'auto';
        return '*';
      });
    }
    data.body.push(tt);
    data.body.push(...this._buildTableBody());
    return data;
  }
  private _buildTableBody(): any[] {
    let body: any[] = [];
    if (this.model.entity === 'produit') {
      if (this.model.filtre === 'ALL_PRODUIT') {
        for (let index = 0, len = this.produits.length; index < len; index++) {
          const element: Produit = this.produits[index];
          body.push([
            {
              text: index + 1,
              style: 'counter'
            },
            {
              text: element.typeProduit
            },
            {
              text: element.libelle
            },
            {
              text: element.periodicite || ''
            },
            {
              text: element.montantMin || ''
            },
            {
              text: element.nbreMiseAvance || ''
            },
            {
              text: element.nbreMiseTotal || ''
            },
            {
              text: element.nbreMisePrelever || ''
            },
            {
              text: element.nbreEcheance || ''
            }
          ])
        }
      } else if (this.model.filtre === 'EPARGNE_PRODUIT') {
        for (let index = 0, len = this.produits.length; index < len; index++) {
          const element: Produit = this.produits[index];
          if (element.typeProduit === 'EPARGNE') {
            body.push([
              {
                text: body.length + 1,
                style: 'counter'
              },
              {
                text: this.datePipe.transform(element.date, 'mediumDate')
              },
              {
                text: element.libelle
              }
            ])
          }
        }
      } else if (this.model.filtre === 'TONTINE_PRODUIT') {
        for (let index = 0, len = this.produits.length; index < len; index++) {
          const element: Produit = this.produits[index];
          if (element.typeProduit === 'TONTINE') {
            body.push([
              {
                text: body.length + 1,
                style: 'counter'
              },
              {
                text: element.libelle
              },
              {
                text: element.periodicite || ''
              },
              {
                text: element.montantMin || ''
              },
              {
                text: element.nbreMiseAvance || ''
              },
              {
                text: element.nbreMiseTotal || ''
              },
              {
                text: element.nbreMisePrelever || ''
              },
              {
                text: element.nbreEcheance || ''
              }
            ])
          }
        }
      }
    } else if (this.model.entity === 'client') {
      for (let index = 0, len = this.clients.length; index < len; index++) {
        const element: Client = this.clients[index];
        body.push([
          {
            text: index + 1,
            style: 'counter'
          },
          {
            text: (element.name || '') + ' ' + (element.firstName || '')
          },
          {
            text: element.numCarte
          },
          {
            text: (element.quartier || '') + ' ' + (element.maison || '')
          },
          {
            text: element.telephone
          },
          {
            text: element.profession
          },
          {
            text: element.activiteExerce
          },
          {
            text: element.lieuExercice
          },
          {
            text: element.email
          }
        ]);
      }
    } else if (this.model.entity === 'comptes') {
      let cptes = [];
      if (this.model.filtre === 'ALL_COMPTE') {
        cptes = this.epargnes.concat(this.tontines);
      } else if (this.model.filtre === 'TONTINE_COMPTE') {
        cptes = this.tontines;
      } else if (this.model.filtre === 'EPARGNE_COMPTE') {
        cptes = this.epargnes;
      }
      let row = [];
      for (let index = 0, len = cptes.length; index < len; index++) {
        const element: Compte = cptes[index];
        row = [];
        row.push({
          text: index + 1,
          style: 'counter'
        });
        if (this.model.filtre === 'ALL_COMPTE') {
          row.push({
            text: element.typeCompte
          });
        }
        row.push({
          text: this.datePipe.transform(element.dateCompte, 'mediumDate')
        });
        row.push({
          text: this.client(element.idClient)
        });
        row.push(
          {
            text: this.currencyPipe.transform(element.montant || element.montantSouscritTontine || 0, 'XOF', true, '2.0')
          });
        if (this.model.filtre !== 'EPARGNE_COMPTE') {
          row.push(
            {
              text: element.miseTontine
            });
          row.push(
            {
              text: element.typeCompte === "TONTINE" ? (element.avanceTontine ? 'Oui' : 'Non') : ''
            });
          row.push(
            {
              text: element.avanceDate ? this.datePipe.transform(element.avanceDate, 'mediumDate') : ''
            });
          row.push(
            {
              text: element.dateCloture ? this.datePipe.transform(element.dateCloture, 'mediumDate') : ''
            });
        }
        body.push(row);
      }
    } else if (this.model.entity === 'recette') {
      for (let index = 0, len = this.recettes.length; index < len; index++) {
        const element: any = this.recettes[index];
        body.push([
          {
            text: body.length + 1,
            style: 'counter'
          },
          {
            text: this.datePipe.transform(element.date, 'mediumDate')
          },
          {
            text: this.client(element.idClient)
          },
          {
            text: this.currencyPipe.transform(element.montant, 'XOF', true, '2.0')
          },
          {
            text: element.motif
          }
        ]);
      }
    }
    return body;
  }

  private _buildTableTitle(): any {
    let title: any[] = [];
    if (this.model.entity === 'produit') {
      let hd;
      if (this.model.filtre === 'ALL_PRODUIT') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: "Type de produit", style: 'tableHeader' }, { text: "Libellé", style: 'tableHeader' }, { text: "Périodicité", style: 'tableHeader' }, { text: "Montant min.", style: 'tableHeader' }, { text: 'Nbre de mise avance', style: 'tableHeader' }, { text: 'Nbre de mise total', style: 'tableHeader' }, { text: 'Nbre de mise prélever', style: 'tableHeader' }, { text: "Nbre d'écheances", style: 'tableHeader' }];
      } else if (this.model.filtre === 'EPARGNE_PRODUIT') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: "Libellé", style: 'tableHeader' }];
      } else if (this.model.filtre === 'TONTINE_PRODUIT') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: "Libellé", style: 'tableHeader' }, { text: "Périodicité", style: 'tableHeader' }, { text: "Montant min.", style: 'tableHeader' }, { text: 'Nbre de mise avance', style: 'tableHeader' }, { text: 'Nbre de mise total', style: 'tableHeader' }, { text: 'Nbre de mise prélever', style: 'tableHeader' }, { text: "Nbre d'écheances", style: 'tableHeader' }];
      }
      title = hd;
    } else if (this.model.entity === 'client') {
      title = [
        { text: 'N°', style: 'tableHeader' }, { text: 'Nom & prénoms', style: 'tableHeader' }, { text: 'Num. carte', style: 'tableHeader' }, { text: 'Quartier & maison', style: 'tableHeader' }, { text: 'Téléphone', style: 'tableHeader' }, { text: 'Profession', style: 'tableHeader' }, { text: 'Activité', style: 'tableHeader' }, { text: "Lieu d'exercice", style: 'tableHeader' }, { text: "Email", style: 'tableHeader' }
      ];
    } else if (this.model.entity === 'comptes') {
      let hd: any = [""];
      if (this.model.filtre === 'ALL_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Type', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Montant souscrit', style: 'tableHeader' }, { text: 'Mise', style: 'tableHeader' }, { text: 'Avance', style: 'tableHeader' }, { text: 'Date avance', style: 'tableHeader' }, { text: 'Date de clotûre', style: 'tableHeader' }];
      } else if (this.model.filtre === 'TONTINE_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Montant souscrit', style: 'tableHeader' }, { text: 'Mise', style: 'tableHeader' }, { text: 'Avance', style: 'tableHeader' }, { text: 'Date avance', style: 'tableHeader' }, { text: 'Date de clotûre', style: 'tableHeader' }];
      } else if (this.model.filtre === 'EPARGNE_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Solde', style: 'tableHeader' }];
      }
      title = hd;
    } else if (this.model.entity === 'recette') {
      title = [
        { text: 'N°', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Montant', style: 'tableHeader' }, { text: 'Motif', style: 'tableHeader' }
      ];
    }
    return title;
  }
  client(idClient) {
    let clt = this.dataProvider.getClientById(idClient);
    if (!clt) return '';
    return clt.name + ' ' + clt.firstName;
  }
}
