import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { fadeInOutScreens } from './animations/fade.animation'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutScreens]
})
export class AppComponent {
  activatedRoute: ActivatedRoute;
  title = 'app';

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData['depth']
  }
}
