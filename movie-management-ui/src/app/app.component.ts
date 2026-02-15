import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header>
        <h1>Movie Management System</h1>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/add-movie" routerLinkActive="active">Add Movie</a>
        </nav>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: Arial, sans-serif;
      min-height: 100vh;
      background: #f0f2f5;
    }

    header {
      background: #2c3e50;
      color: white;
      padding: 20px 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      margin: 0 0 15px 0;
      font-size: 24px;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      background: #34495e;
      border-radius: 6px;
      transition: background 0.3s;
      font-weight: 600;
    }

    nav a:hover {
      background: #475d75;
    }

    nav a.active {
      background: #007bff;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {}