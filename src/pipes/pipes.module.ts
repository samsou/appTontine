import { NgModule } from '@angular/core';
import { RecherchePipe } from './recherche/recherche';
import { TypedPipe } from './typed/typed';
import { CloturerPipe } from './cloturer/cloturer';
import { AccordePipe } from './accorde/accorde';
@NgModule({
	declarations: [RecherchePipe,
    TypedPipe,
    CloturerPipe,
    AccordePipe
  ],
	imports: [],
	exports: [RecherchePipe,
    TypedPipe,
    CloturerPipe,
    AccordePipe
  ]
})
export class PipesModule {}
