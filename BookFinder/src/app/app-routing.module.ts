import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookDetailComponent} from './features/books/components/book-detail/book-detail.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule)
    },
    {
        path: '**',
        redirectTo: ''
    },
    {
        path: 'book/:id',
        component: BookDetailComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
