import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { Client, Compte, Produit } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';

declare let pdfMake: any;
@Component({
  selector: 'audits1',
  templateUrl: 'audits1.html'
})
export class Audits1Component {
  model: any = {
    entity: '',
    filtre: '',
    datedebut:Date,
    datefin:Date
  };

  totalSolde : number =0;
  totalDemande : number =0;
  filtres: any[];
  @ViewChild('iframe') iframe: any;
  date1: any;
  date2: any;
  produits: any[] = [];
  clients: any[] = [];
  clientsPeriode: any[] = [];
  maMap = new Map();
  recettes: any[] = [];
  recettesPeriode: any[] = [];
  tontines: Compte[] = [];
  epargnes: Compte[] = [];
  credits: Compte[] = [];

  constructor(private dataProvider: DataProvider, private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
  }
  ngAfterViewInit() {
    this.getProduits();
    this.getClients();
    this.getRecettes();
    this.getComptes('EPARGNE');
    this.getComptes('TONTINE');
    this.getComptes('CREDIT');
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
      }else if (type === 'CREDIT') {
        this.credits = cptes;
      }
    }, (err) => {
    });
  }
  getRecettes() {
    //this.recettes = this.dataProvider.userData.RECETTES;
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

  getClientsPeriode(date1:Date,date2:Date) {
    if((date1 && date2) && (date1 < date2)){
      this.clients=this.clients.filter(client=>{
        console.log('------------ client date');
        console.log(client.date);
        console.log(new Date(client.date).getTime());
        console.log('------------');
        console.log('------------ date debut');
        console.log(date1);
        console.log(new Date(date1).getTime());
        console.log('------------');
        console.log('------------ date fin');
        console.log(date2);
        console.log(new Date(date2).getTime());
        console.log('------------');
        return (new Date(client.date).getTime()>= new Date(date1).getTime()) && (new Date(client.date).getTime() <= new Date(date2).getTime());
        });
    };
  };

  getRecettesPeriode(date1:Date,date2:Date) {
    if((date1 && date2) && (date1 < date2)){
      this.recettesPeriode = [];
      this.recettesPeriode=this.recettes.filter(recette=>(new Date(recette.date).getTime() > new Date(date1).getTime()));//.filter(rec => (new Date(rec.date).getTime() <= new Date(date2).getTime()));
      this.recettesPeriode=this.recettesPeriode.filter(rec => (new Date(rec.date).getTime() <= new Date(date2).getTime()));
    };
  };




  getProduits() {
    this.dataProvider.getProduits().subscribe((produits: Produit[]) => {
      this.produits = produits;
    }, (err) => {
    });
  }
  // onEntityChange() {
  //   this.model.filtre = "";
  //   this.filtres = [];
  //   if (this.model.entity === 'produit') {
  //     this.filtres = [
  //       {
  //         libelle: 'Tous les produits',
  //         code: 'ALL_PRODUIT'
  //       },
  //       {
  //         libelle: 'Les produits Epargnes',
  //         code: 'EPARGNE_PRODUIT'
  //       },
  //       {
  //         libelle: 'Les produits Tontines',
  //         code: 'TONTINE_PRODUIT'
  //       },
  //       {
  //         libelle: 'Les produits Crédits',
  //         code: 'CREDIT_PRODUIT'
  //       }
  //     ];
  //   } else if (this.model.entity === 'client') {
  //     this.filtres = [
  //       {
  //         libelle: 'Tous les clients',
  //         code: 'ALL_CLIENT'
  //       },
  //       /*  {
  //          libelle: 'Les clients qui ont un compte epargne et tontine',
  //          code: 'CLIENT_ALL_COMPTES'
  //        } */
  //     ];
  //   } else if (this.model.entity === 'comptes') {
  //     this.filtres = [
  //       {
  //         libelle: 'Tous les comptes',
  //         code: 'ALL_COMPTE'
  //       },
  //       {
  //         libelle: 'Les comptes tontines',
  //         code: 'TONTINE_COMPTE'
  //       },
  //       {
  //         libelle: 'Les comptes epargnes',
  //         code: 'EPARGNE_COMPTE'
  //       }
  //       ,
  //       {
  //         libelle: 'Les comptes crédits',
  //         code: 'CREDIT_COMPTE'
  //       }
  //     ];
  //   } else if (this.model.entity === 'recette') {
  //     this.filtres = [
  //       {
  //         libelle: 'Toutes nos recettes',
  //         code: 'ALL_RECETTE'
  //       },
  //       /* {
  //         libelle: 'Les recettes entre',
  //         code: 'RECETTE_INTERVAL'
  //       } */
  //     ];
  //   }
  // }
  // onEntityChange()
  // onFiltreChange()
  onEntityChange() {
   console.log(this.model.datedebut);
   console.log(this.model.datefin);

   if (this.model.entity === 'frais_ouverture'){
       this.getClientsPeriode(this.model.datedebut,this.model.datefin);
       console.log(this.clients);
   }

   if (this.model.entity === 'recettes'){
    this.getRecettesPeriode(this.model.datedebut,this.model.datefin);
    //console.log(this.clients);
}

    // if (this.model.filtre === 'RECETTE_INTERVAL') {

    // }
  if (this.model.entity)
    this.buildEtat();
  }
  private getTitle() {
    if (this.model.entity === 'recettes') {
      return "Les Recettes";
    } else if (this.model.entity === 'tontines_clotures') {
      return "Les Tontines cloturés";
    }else if (this.model.entity === 'avances_effectuees') {
      return "Les Avances effectuées";
    } else if (this.model.entity === 'frais_ouverture') {
      return "Frais d'ouverture de Comptes";
    } else if (this.model.entity === 'depot_effectues') {
      return "Les Dépots effectués";
    } else if (this.model.entity === 'retraits_effectues') {
      return "Les Retraits effectués";
    } else if (this.model.entity === 'dossier_etude') {
      return "Les Dossiers en Etude";
    } else if (this.model.entity === 'dossier_accordes') {
      return "Les Dossiers Accordés";
    } else if (this.model.entity === 'remboursements') {
      return "Les Remboursements";
    } else if (this.model.entity === 'frais_dossiers') {
      return "Les Frais de Dossiers";
    } else if (this.model.entity === 'impayes') {
      return "Les Impayés";
    }
    return '';
  }
  private buildEtat() {
    let data: any = this.buildBody();
    let pageOrientation;
    if (this.model.entity === 'frais_ouverture') pageOrientation = 'landscape'
    if (this.model.entity === 'comptes') pageOrientation = 'landscape'
    let dd = {
      pageOrientation,
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + ' of ' + pageCount,
          style: 'footer'
        };
      },
      content: this._buildContent(data),
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
          width: 10,
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
    if (['frais_ouverture', 'EPARGNE_COMPTE', 'CREDIT_COMPTE'].indexOf(this.model.entity) !== -1) {
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

     if (this.model.entity === 'frais_ouverture') {
      this.totalSolde=0;
      console.log(this.clients);
      if(this.clients.length>0){
        for (let index = 0, len = this.clients.length; index < len; index++) {
          const element: Client = this.clients[index];
          if(element.id){
            if(!!element.fraisOuverture) this.totalSolde=this.totalSolde + (+element.fraisOuverture);
          }
            body.push([
            {
              text: index + 1,
              style: 'counter'
            },
            {
              text: (element.name || '') + ' ' + (element.firstName || '')
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
              text: element.fraisOuverture
            }
          ]);
        }
      }

    } else if (this.model.entity === 'recettes') {
      this.totalSolde=0;
      console.log(this.recettesPeriode);
      if(this.recettesPeriode.length>0){
        for (let index = 0, len = this.recettesPeriode.length; index < len; index++) {
          const element: Compte = this.recettesPeriode[index];
          if(element.id){
            if(!!element.montant) this.totalSolde=this.totalSolde + (+element.montant);
          }
            body.push([
            {
              text: index + 1,
              style: 'counter'
            },
            {
              text: this.client(element.idClient) || ''
            },
            {
              text: (element.date ? this.datePipe.transform(element.date, 'dd/MM/yyyy') : '')
            },
            {
              text: element.motif
            },
            {
              text: element.montant
            }
          ]);
        }
      }

    } else if (this.model.entity === 'comptes') {
      let cptes = [];
      this.totalSolde=0;
      this.totalDemande=0;
      if (this.model.filtre === 'ALL_COMPTE') {
        cptes = this.epargnes.concat(this.tontines);
      } else if (this.model.filtre === 'TONTINE_COMPTE') {
        cptes = this.tontines;
      } else if (this.model.filtre === 'EPARGNE_COMPTE') {
        cptes = this.epargnes;
      }else if (this.model.filtre === 'CREDIT_COMPTE') {
        cptes = this.credits;
      }
      let row = [];
      for (let index = 0, len = cptes.length; index < len; index++) {
        const element: Compte = cptes[index];
        if(!!element.montantDemande) this.totalDemande=this.totalDemande + (+element.montantDemande);
        if(!!element.montant) this.totalSolde=this.totalSolde + (+element.montant);
        row = [];
        row.push({
          text: index + 1,
          style: 'counter'
        });
        if (this.model.filtre === 'ALL_COMPTE') {
        row.push({
            text: element.typeCompte || ''
          });
        }
        row.push({
          text: this.datePipe.transform(element.dateCompte, 'mediumDate')
        });
        row.push({
          text: this.client(element.idClient) || ''
        });
        row.push(
          {
            text: this.currencyPipe.transform(element.montant || element.montantSouscritTontine || 0, 'XOF', true, '2.0')
          });
        if (this.model.filtre !== 'TONTINE_COMPTE' && this.model.filtre!== 'CREDIT_COMPTE') {
          row.push(
            {
              text: element.miseTontine || ''
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
        if (this.model.filtre === 'CREDIT_COMPTE') {
          row.push({
              text: element.montantDemande || ''
            });
            row.push(
              {
                text: element.accordDate ? this.datePipe.transform(element.accordDate, 'mediumDate') : ''
            });
            row.push(
              {
                text: element.produit.nbreEcheance || ''
            });
            row.push(
              {
                text: element.deposit || ''
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

  private _buildContent(data): any[] {
    let cont: any[] = [];
    cont.push(
    {
      text: "GALA",
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
    });
    if (this.model.entity === 'comptes' || this.model.entity === 'frais_ouverture'|| this.model.entity === 'recettes') {
      cont.push({
      background: '#b45c5c',
      alignment: 'left',
      width: '*',
      height: 0.2,
      margin: [10, 5, 10, 5],
      text: 'Solde Total Compte :  ' + this.totalSolde
    });
  };
  if (this.model.entity === 'comptes' && this.model.filtre === 'CREDIT_COMPTE') {
    cont.push(
    {
      background: '#b45c5c',
      alignment: 'left',
      width: '*',
      height: 0.2,
      margin: [10, 5, 10, 5],
      text: 'Montant Demande Total :  ' + this.totalDemande
    });
    };
    cont.push({
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
  );
    return cont;
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
      }else if (this.model.filtre === 'CREDIT_PRODUIT') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: "Libellé", style: 'tableHeader' }, { text: "Périodicité", style: 'tableHeader' }, { text: "Montant min.", style: 'tableHeader' }, { text: 'Nbre Ech.', style: 'tableHeader' }, { text: 'Déposit', style: 'tableHeader' }, { text: 'Nbre de mise prélever', style: 'tableHeader' }, { text: "Nbre d'écheances", style: 'tableHeader' }];
      }
      title = hd;
    } else if (this.model.entity === 'frais_ouverture') {
      title = [
        { text: 'N°', style: 'tableHeader' }, { text: 'Nom & prénoms', style: 'tableHeader' }, { text: 'Quartier & maison', style: 'tableHeader' }, { text: 'Téléphone', style: 'tableHeader' }, { text: 'Profession', style: 'tableHeader' }, { text: 'Activité', style: 'tableHeader' }, { text: "Frais ouverture", style: 'tableHeader' }
      ];
    } else if (this.model.entity === 'recettes') {
      title = [
        { text: 'N°', style: 'tableHeader' }, { text: 'Nom & prénoms', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Motif', style: 'tableHeader' }, { text: 'Montant', style: 'tableHeader' }
      ];
    } else if (this.model.entity === 'comptes') {
      let hd: any = [""];
      if (this.model.filtre === 'ALL_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Type', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Montant souscrit', style: 'tableHeader' }, { text: 'Mise', style: 'tableHeader' }, { text: 'Avance', style: 'tableHeader' }, { text: 'Date avance', style: 'tableHeader' }, { text: 'Date de clotûre', style: 'tableHeader' }];
      } else if (this.model.filtre === 'TONTINE_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Montant souscrit', style: 'tableHeader' }, { text: 'Mise', style: 'tableHeader' }, { text: 'Avance', style: 'tableHeader' }, { text: 'Date avance', style: 'tableHeader' }, { text: 'Date de clotûre', style: 'tableHeader' }];
      } else if (this.model.filtre === 'EPARGNE_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Solde', style: 'tableHeader' }];
      }else if (this.model.filtre === 'CREDIT_COMPTE') {
        hd = [{ text: 'N°', style: 'tableHeader' }, { text: 'Date de création', style: 'tableHeader' }, { text: 'Client', style: 'tableHeader' }, { text: 'Solde', style: 'tableHeader' }, { text: 'Mt. Démande', style: 'tableHeader' }, { text: 'Date Accord', style: 'tableHeader' }, { text: 'Nbre Echéa.', style: 'tableHeader' }, { text: 'Déposit', style: 'tableHeader' }];
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
