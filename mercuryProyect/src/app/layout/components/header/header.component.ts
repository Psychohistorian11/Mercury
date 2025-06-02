import { Component } from '@angular/core';
import { SearchComponent } from '../../../shared/generalComponents/search/search.component';
import { Router, RouterLink } from '@angular/router';
import { ActivateLaboratoryService } from '../../../auth/services/activate-laboratory.service';
import { NgIf } from '@angular/common';
import { PlaySongComponent } from '../../../shared/generalComponents/play-song/play-song.component';
import { GetUserService } from '../../../shared/generalServices/get-user.service';
import { User } from '../../../auth/interfaces/user.interface'
import { SearchService } from '../../../features/services/search.service';
import { GetTokenService } from '../../../shared/generalServices/get-token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent, RouterLink, NgIf, PlaySongComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  showLaboratory = false;
  currentToken: any;
  menuOpen = false;

  constructor(
    private activate: ActivateLaboratoryService,
    private router: Router,
    private token: GetTokenService,
    private search: SearchService,
    private cookieService: CookieService
  ) {
    this.activate.decision$.subscribe((decision: boolean) => {
      this.showLaboratory = decision;
    });
    this.currentToken = this.token.getToken();
  }

  onBackMenu() {
    if (this.currentToken.role === 'artist') {
      this.router.navigate([`/home/artist/11`]);
    } else {
      this.router.navigate([`/home/artist/11`]);
    }
  }

  onMysongsClick() {
    this.search.deactivateAlarm();
    this.router.navigate([`/home/artist/11/my-songs`]);
    this.closeMenu();
  }

  onProfileClick() {
    if (this.currentToken.role === 'artist') {
      this.router.navigate([`/home/artist/${this.currentToken.sub}/profile`]);
    } else {
      this.router.navigate([`/home/${this.currentToken.sub}/profile`]);
    }
    this.closeMenu();
  }

  onExitClick() {
    localStorage.removeItem('currentSong');
    this.clearCookies();
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  private clearCookies() {
    const allCookies = this.cookieService.getAll();

    for (const cookieName in allCookies) {
      if (allCookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
