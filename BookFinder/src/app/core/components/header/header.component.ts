import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { BookService } from '../../services/book.service';
import {RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLinkActive,
    AsyncPipe
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  favoritesCount$ = this.bookService.favorites$.pipe(
    map(favorites => favorites.length)
  );

  constructor(private bookService: BookService) {}
}
