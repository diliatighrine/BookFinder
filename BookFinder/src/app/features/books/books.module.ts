import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { BookFavoritesComponent } from './components/book-favorites/book-favorites.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BookListComponent,
    BookDetailComponent,
    BookSearchComponent,
    BookFavoritesComponent
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BooksModule { }
