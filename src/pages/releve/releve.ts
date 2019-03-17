import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

declare let pdfMake: any;

@IonicPage()
@Component({
  selector: 'page-releve',
  templateUrl: 'releve.html',
})
export class RelevePage {
  isLoading: boolean = true;
  @ViewChild('frameElement') frameElement: any;
  action: any;
  model: any;
  mises: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: DataProvider, public datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
    this.action = navParams.get('action');
    this.model = Object.assign({}, navParams.get('model'));
  }
  ionViewDidLoad() {
    if (this.model.type === 'TONTINE') {
      try {
        this.dataProvider.getMises(this.model).subscribe((mises) => {
          this.mises = mises;
          this._buildPrintContent();
        }, (e) => {

        });
      } catch (error) {

      }
    } else
      this._buildPrintContent();
  }
  private async _buildPrintContent() {
    let data;
    if (this.action === 'RELEVE')
      data = await this._buildReleve();
    else if (this.action === 'QUITTANCE')
      data = await this._buildQuittance();

    let dd = {
      info: {
        title: (this.action || '') + ' Tontine',
        author: 'Tontine',
        subject: (this.action || '') + ' document',
        keywords: 'Tontine',
      },
      footer: data.footer,
      pageMargins: data.pageMargins,
      pageOrientation: data.pageOrientation || 'portrait',
      watermark: data.watermark,
      content: [
        {
          columns: [
            {
              text: "GALA MICROFINANCE",
              style: 'head',
              fontSize: 20,
              bold: true
            },
            {
              qr: "GALA MICROFINANCE",
              alignment: 'right',
              fit: 50
            }
          ]
        },
        {
          background: '#b45c5c',
          alignment: 'center',
          width: '*',
          height: 0,
          margin: [10, 5, 10, 5],
          text: ''
        }, ...data.content],
      styles: Object.assign({}, {
        qr: {
          width: 30,
          fit: 35,
          height: 30
        }
      }, data.styles)
    };
    let pdf = pdfMake.createPdf(dd);
    pdf.getDataUrl((url) => {
      this.isLoading = false;
      this.frameElement.nativeElement.src = url;
    });
  }
  _buildQuittance(): any {
    return {
      footer: (currentPage, pageCount) => {
        return {
          margin: [40, 1, 40, 2],
          columns: [
            {
              with: '*',
              text: `Généré le ${this.datePipe.transform(new Date(), "mediumDate")}`
            },
            { text: `${currentPage}/${pageCount}`, alignment: 'right', with: '*' }
          ]
        };
      },
      watermark: { text: `QUITTANCE DE ${this.model.type}`, color: 'blue', opacity: 0.05, bold: true, italics: true },
      content: [
        {
          margin: [0, 4, 0, 10],
          alignment: 'center',
          table: {
            alignment: 'center',
            widths: ['*'],
            body: [
              [
                [

                  {
                    text: `Quittance de ${this.model.type}`.toUpperCase(),
                    alignment: 'center',
                    fontSize: 19,
                    bold: true
                  },
                  {
                    text: `sur le compte ${this.model.id}`.toUpperCase(),
                    alignment: 'center',
                    fontSize: 17,
                    bold: true
                  },
                  {
                    text: `DU CLIENT ${this.model.client.name} ${this.model.client.firstName}`.toUpperCase(),
                    alignment: 'center',
                    fontSize: 15,
                    bold: true
                  }
                ]
              ]
            ]
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
              //if (i == 0) return 'blue';
              return (i % 2 === 0) ? '#afced7' : null;
            }
          }
        },
        {
          margin: [20, 50, 20, 5],
          columns: [
            {
              width: '30%',
              text: `Nom du ${this.model.type === 'DEPOT' ? 'déposant' : 'retirant'}`,
              alignment: 'left',
              bold: true
            },
            {
              text: this.model.nameDeposant || this.model.nameRetirant || '---',
              alignment: 'center'
            }
          ]
        },
        {
          margin: [20, 5, 20, 5],
          columns: [
            {
              width: '30%',
              text: `Télephone du ${this.model.type === 'DEPOT' ? 'déposant' : 'retirant'}`,
              alignment: 'left',
              bold: true
            },
            {
              text: this.model.phoneDeposant || this.model.phoneRetirant || '---',
              alignment: 'center'
            }
          ]
        },
        {
          margin: [20, 5, 20, 5],
          columns: [
            {
              width: '30%',
              text: `Montant ${this.model.type === 'DEPOT' ? 'déposé' : 'retiré'}`,
              alignment: 'left',
              bold: true
            },
            {
              text: this.currencyPipe.transform(this.model.montant, 'XOF', true, '2.0'),
              alignment: 'center'
            }
          ]
        },
        {
          margin: [20, 5, 20, 5],
          columns: [
            {
              width: '30%',
              text: `Numéro de pièce du  ${this.model.type === 'DEPOT' ? 'déposant' : 'retirant'}`,
              alignment: 'left',
              bold: true
            },
            {
              text: this.model.numCarteRetirant || this.model.numCarteDeposant || '---',
              alignment: 'center'
            }
          ]
        }
      ]
    };
  }
  private async _buildReleve() {
    let ops = [];
    if (this.model.type === 'TONTINE') {
      let solde = 0, montant = 0;
      ops = (this.mises || []).map((d) => {
        montant = this.model.montantSouscritTontine * d.mise;
        solde += (montant || 0);
        return {
          ...d,
          operation: `${d.mise || 0} mise(s) efectuées`,
          type: 'depot',
          montant: montant,
          solde: montant
        }
      }).reverse();
      if (this.model.dateCloture) {
        ops.push(
          {
            date: this.model.dateCloture,
            operation: 'Cloture du compte',
            solde: 0
          }
        );
      }
      if (this.model.avanceDate) {
        ops.push(
          {
            date: this.model.avanceDate,
            operation: 'Avance sur le compte',
            solde:this.model.montantAvance
          }
        );
      }

      ops.sort((a, b) => {
        return a.date - b.date;
      });
    } else {
      ops.push(
        {
          date: Date.now(),
          operation: 'Solde actuel sur  le compte',
          solde: this.model.montantAdhesion || this.model.montant
        }
      );
      ops.push(...(this.dataProvider.userData.depots || []).reverse().map((d) => {
        //${d.montant ? 'pour un montant de  ' + d.montant : ''}
        return {
          ...d,
          operation: `Dépôt sur le compte ${d.nameDeposant ? 'par ' + d.nameDeposant + '(' + d.phoneDeposant + ')' : ''} `,
          type: 'depot',
          montant: d.montant
        }
      }).reverse());
      ops.push(...(this.dataProvider.userData.retraits || []).reverse().map((d) => {
        // ${d.montant ? 'pour un montant de ' + d.montant : ''}
        return {
          ...d,
          operation: `Retrait sur le compte ${d.nameRetirant ? 'par ' + d.nameRetirant + '(' + d.phoneRetirant + ')' : ''}`,
          type: 'retrait',
          montant: d.montant
        }
      }).reverse());
      ops.sort((a, b) => {
        return a.date - b.date;
      });
      let solde = parseInt(this.model.montant) || 0;
      ops = ops.map((o) => {
        if (o.solde)
          solde = o.solde;
        if (o.type === 'depot')
          solde -= (o.montant || 0);
        else if (o.type === 'retrait')
          solde += (o.montant || 0);

        return {
          ...o,
          solde: o.solde || o.montant || solde
        }
      });
      ops.reverse();
    }
    return {
      footer: (currentPage, pageCount) => {
        return {
          margin: [40, 1, 40, 2],
          columns: [
            {
              with: '*',
              text: `Généré le ${this.datePipe.transform(new Date(), "mediumDate")}`
            },
            { text: `${currentPage}/${pageCount}`, alignment: 'right', with: '*' }
          ]
        };
      },
      watermark: { text: 'RELEVE DE COMPTE', color: 'blue', opacity: 0.05, bold: true, italics: true, fontSize: 10 },
      content: [
        {
          margin: [0, 4, 0, 10],
          alignment: 'center',
          table: {
            widths: ['*'],
            alignment: 'center',
            body: [
              [
                [
                  {
                    text: "RELEVE DE COMPTE",
                    alignment: 'center',
                    fontSize: 22,
                    bold: true
                  },
                  {
                    text: `DU CLIENT ${this.model.client.name} ${this.model.client.firstName}`.toUpperCase(),
                    alignment: 'center',
                    fontSize: 15,
                    bold: true
                  }
                ]
              ]
            ]
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
              //if (i == 0) return 'blue';
              return (i % 2 === 0) ? '#afced7' : null;
            }
          }
        },
        {
          margin: [0, 10, 0, 2],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [{
                text: 'Date',
                bold: true,
                alignment: 'center'
              }, {
                text: 'Opération',
                bold: true,
                alignment: 'center'
              },
              {
                text: 'Solde',
                bold: true,
                alignment: 'center'
              }
              ],
              ...ops.map((o) => {
                return [
                  {
                    text: this.datePipe.transform(o.date || this.model.dateCompte, 'medium'),
                    italics: true,
                    padding: [2, 1, 2, 1]
                  },
                  {
                    text: o.operation,
                    alignment: 'center'
                  },
                  {
                    text: o.solde ? this.currencyPipe.transform(o.solde, 'XOF', true, '2.0') : ''
                  }
                ]
              })
            ]
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
      ]
    }

  }



}
