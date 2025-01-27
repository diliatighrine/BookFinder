import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookFavoritesComponent } from './components/book-favorites/book-favorites.component';

const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'book/:id',
    component: BookDetailComponent
  },
  {
    path: 'favorites',
    component: BookFavoritesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
