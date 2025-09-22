import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlay,
  faPause,
  faCaretDown,
  faCaretUp
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-controls-bottom',
  imports: [
    FontAwesomeModule,
    NgIf,
    NgClass
  ],
  templateUrl: './controls-bottom.component.html',
  styleUrl: './controls-bottom.component.scss'
})
export class ControlsBottomComponent {
  state = inject(StateService);

  faPlay = faPlay;
  faPause = faPause;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
}
