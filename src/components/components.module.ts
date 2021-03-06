import { DatePipe, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from './../directives/directives.module';
import { AuditsComponent } from './audits/audits';
import { Audits1Component } from './audits1/audits1';
import { BoardComponent } from './board/board';
import { ClientComponent } from './client/client';
import { CreateEpargneComponent } from './create-epargne/create-epargne';
import { CreateTontineComponent } from './create-tontine/create-tontine';
import { DepotEpargneComponent } from './depot-epargne/depot-epargne';
import { EpargneComponent } from './epargne/epargne';
import { MiseComponent } from './mise/mise';
import { ProduitComponent } from './produit/produit';
import { RecettesComponent } from './recettes/recettes';
import { RetraitEpargneComponent } from './retrait-epargne/retrait-epargne';
import { RetraitCreditComponent } from './retrait-credit/retrait-credit';
import { StatsComponent } from './stats/stats';
import { TontineComponent } from './tontine/tontine';
import { CreditComponent } from './credit/credit';
import { CreateCreditComponent } from './create-credit/create-credit';

@NgModule({
    declarations: [ClientComponent,
        StatsComponent,
        AuditsComponent,
        Audits1Component,
        BoardComponent,
        TontineComponent,
        CreateTontineComponent,
        MiseComponent,
        EpargneComponent,
        CreditComponent,
        CreateEpargneComponent,
        CreateCreditComponent,
        DepotEpargneComponent,
        RetraitEpargneComponent,
        RetraitCreditComponent,
        ProduitComponent,
        RecettesComponent],
    imports: [FormsModule, IonicModule, PipesModule, DirectivesModule],
    exports: [ClientComponent,
        StatsComponent,
        AuditsComponent,
        Audits1Component,
        BoardComponent,
        TontineComponent,
        CreateTontineComponent,
        MiseComponent,
        EpargneComponent,
        CreditComponent,
        CreateEpargneComponent,
        CreateCreditComponent,
        DepotEpargneComponent,
        RetraitEpargneComponent,
        RetraitCreditComponent,
        ProduitComponent,
        RecettesComponent],
    providers: [DatePipe, CurrencyPipe]
})
export class ComponentsModule { }
