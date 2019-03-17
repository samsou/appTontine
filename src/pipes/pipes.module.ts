import { NgModule } from '@angular/core';
import { RecherchePipe } from './recherche/recherche';
import { TypedPipe } from './typed/typed';
import { CloturerPipe } from './cloturer/cloturer';
@NgModule({
	declarations: [RecherchePipe,
    TypedPipe,
    CloturerPipe],
	imports: [],
	exports: [RecherchePipe,
    TypedPipe,
    CloturerPipe]
})
export class PipesModule {}
