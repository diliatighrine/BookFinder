import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {BookService} from '../../services/book.service'; // ✅ Import Router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<any> | undefined;
  favoritesCount$: Observable<number> | undefined;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private router: Router // ✅ Inject Router
  ) {}

  ngOnInit(): void {
    // Observe current user authentication state
    this.currentUser$ = this.authService.getCurrentUser();

    // Fetch user-specific favorites count
    this.favoritesCount$ = this.bookService.getFavorites().pipe(
      map(favorites => favorites?.length || 0) // ✅ Ensure count is always a number
    );
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    });
  }
}
