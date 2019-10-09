import { trigger, animate, transition, style, query } from '@angular/animations'

export const fadeInOutScreens =
  trigger('routeAnimation', [
    transition( '* => *', [
      query(':enter',
        [
          style({ opacity: 0 })
        ],
        { optional: true }
      ),
      query(':leave',
        [
          style({ opacity: 1 }),
          animate('0s', style({ opacity: 0 }))
        ],
          { optional: true }
      ),
      query(':enter',
        [
          style({ opacity: 0 }),
          animate('0.5s', style({ opacity: 1 }))
        ],
        { optional: true }
      )
    ]),
  ]);
