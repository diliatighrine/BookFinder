import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookDetailComponent} from './features/books/components/book-detail/book-detail.component';
import {LoginComponent} from './features/authentification/components/login/login.component';
import {AuthGuard} from './core/guards/auth.guard';
import {RegisterComponent} from './features/authentification/components/register/register.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'book/:id',
        component: BookDetailComponent,
        canActivate: [AuthGuard]
    },
    {   path: 'login',
        component: LoginComponent
    },
    { path: 'register',
      component: RegisterComponent
    },
    {
      path: '**',
      redirectTo: ''
    },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
