import { NgModule } from '@angular/core';
import { RecherchePipe } from './recherche/recherche';
import { TypedPipe } from './typed/typed';
@NgModule({
	declarations: [RecherchePipe,
    TypedPipe],
	imports: [],
	exports: [RecherchePipe,
    TypedPipe]
})
export class PipesModule {}
