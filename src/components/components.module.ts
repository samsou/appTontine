import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { PipesModule } from '../pipes/pipes.module';
import { AuditsComponent } from './audits/audits';
import { BoardComponent } from './board/board';
import { ClientComponent } from './client/client';
import { CreateEpargneComponent } from './create-epargne/create-epargne';
import { CreateTontineComponent } from './create-tontine/create-tontine';
import { DepotEpargneComponent } from './depot-epargne/depot-epargne';
import { EpargneComponent } from './epargne/epargne';
import { MiseComponent } from './mise/mise';
import { RetraitEpargneComponent } from './retrait-epargne/retrait-epargne';
import { StatsComponent } from './stats/stats';
import { TontineComponent } from './tontine/tontine';

@NgModule({
    declarations: [ClientComponent,
        StatsComponent,
        AuditsComponent,
        BoardComponent,
        TontineComponent,
        CreateTontineComponent,
        MiseComponent,
        EpargneComponent,
        CreateEpargneComponent,
        DepotEpargneComponent,
        RetraitEpargneComponent],
    imports: [FormsModule, IonicModule, PipesModule],
    exports: [ClientComponent,
        StatsComponent,
        AuditsComponent,
        BoardComponent,
        TontineComponent,
        CreateTontineComponent,
        MiseComponent,
        EpargneComponent,
        CreateEpargneComponent,
        DepotEpargneComponent,
        RetraitEpargneComponent]
})
export class ComponentsModule { }
