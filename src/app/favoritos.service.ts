import { FavoritosService } from '@cnj/uikit';
import { MenuItem } from '@cnj/uikit/lib/layout/nav/menu/menu-item/menu-item.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AppFavoritosService extends FavoritosService {
  salvar(itens: MenuItem[]): Observable<void> {
    return of();
  }
  buscar(): Observable<MenuItem[]> {
    return of();
  }


}
