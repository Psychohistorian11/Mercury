import { Component } from '@angular/core';
import { FooterComponent } from '../../../layout/components/footer/footer.component';
import { HeaderComponent } from "../../../layout/components/header/header.component";
import { AsideComponent } from "../../../layout/components/aside/aside.component";
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { GetTokenService } from '../../../shared/generalServices/get-token.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, AsideComponent, MainComponent, RouterOutlet, ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  idUser: string = ''
  token: any 

  constructor(private router: Router,
              private route: ActivatedRoute,
              //private getToken: GetTokenService
              ) {
            
    //this.token = this.getToken.getToken()

  }

  isMainRoute() {
    /*this.route.params.subscribe(params => {
      this.idUser =  '11' //params['id']; 
    });
*/
    this.idUser =  '11'

    //return this.router.url === `/home/${this.token.sub}` || this.router.url === `/home/artist/${this.token.sub}`;
    return this.router.url === `/home/11` || this.router.url === `/home/artist/11`;


  }

}

