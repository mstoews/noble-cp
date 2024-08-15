import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state(
    'close',
    style({
      'min-width': '0px',
    })
  ),
  state(
    'open',
    style({
      'min-width': '200px',
    })
  ),
  transition('close => open', animate('1s ease-in')),
  transition('open => close', animate('1s ease-in')),
]);

export const onMainContentChange = trigger('onMainContentChange', [
  state(
    'close',
    style({
      'margin-left': '0px',
    })
  ),
  state(
    'open',
    style({
      'margin-left': '0px',
    })
  ),
  transition('close => open', animate('500ms ease-in')),
  transition('open => close', animate('500ms ease-in')),
]);

export const animateText = trigger('animateText', [
  state(
    'hide',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state(
    'show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);

export const markedTrigger = trigger('markedState', [
  state('default', style({
    border: '1px solid black',
    backgroundColor: 'transparent',
    padding: '20px'
  })),
  state('marked', style({
    border: '2px solid blue',
    backgroundColor: '#caeff9',
    padding: '19px'
  })),
  transition('default => marked', [
    style({
      border: '2px solid black',
      padding: '19px'
    }),
    animate('200ms ease-out', style({
      transform: 'scale(1.05)'
    })),
    animate(200)
  ]),
  transition('marked => default', [
    style({
      border: '1px solid blue',
      padding: '20px'
    }),
    animate('300ms ease-out')
  ]),
  // transition('marked => default', animate('300ms ease-out')),
]);

export const itemStateTrigger = trigger('itemState', [
  transition(':enter', [
    animate('500ms ease-out', keyframes([
      style({
        opacity: 0,
        transform: 'translateX(-100%)',
        offset: 0
      }),
      style({
        opacity: 1,
        transform: 'translateX(15%)',
        offset: 0.4
      }),
      style({
        opacity: 1,
        transform: 'translateX(0)',
        offset: 1
      })
    ]))
  ]),
  transition(':leave', [
    animate('500ms ease-in', keyframes([
      style({
        opacity: 1,
        transform: 'translateX(0)'
      }),
      style({
        transform: 'translateX(-15%)'
      }),
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      })
    ]))
  ]),
  transition('slidUp => slidDown', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate('300ms ease-out', style({
      transform: 'translateY(0)'
    }))
  ]),
  transition('slidDown => slidUp', [
    style({
      transform: 'translateY(0)'
    }),
    animate('300ms ease-out', style({
      transform: 'translateY(-100%)'
    }))
  ])
]);

export const slideStateTrigger = trigger('slideState', [
  transition(':enter', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate('300ms ease-out', style({
      transform: 'translateY(0)'
    }))
  ]),
  transition(':leave', [
    style({
      transform: 'translateY(0)'
    }),
    animate('300ms ease-out', style({
      transform: 'translateY(-100%)'
    }))
  ])
]);


export const sideNavTrigger = trigger('sideNavigationState', [
  state('default', style({
    backgroundColor: 'transparent',
    padding: '2px'
  })),
  state('expanded', style({
    backgroundColor: '#caeff9',
    padding: '19px'
  })),
  transition('default => marked', [
    style({
      transform: 'translateY(-100%)',
      padding: '19px'
    }),
    animate('200ms ease-out', style({
      transform: 'scale(1.05)'
    })),
    animate(200)
  ]),
  transition('marked => default', [
    style({
      padding: '20px',
      transform: 'translateY(100%)',
    }),
    animate('300ms ease-out')
  ]),
]);
