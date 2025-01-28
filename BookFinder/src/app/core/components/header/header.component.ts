import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLinkActive,
    AsyncPipe,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  favoritesCount$: Observable<number>;

  constructor(private bookService: BookService) {
    this.favoritesCount$ = this.bookService.favorites$.pipe(
      map(favorites => favorites.length)
    );
  }
}
