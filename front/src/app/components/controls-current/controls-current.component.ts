import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
  faShuffle,
  faBars,
  faCaretDown,
  faCaretUp,
  faMusic
} from '@fortawesome/free-solid-svg-icons';
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
@Component({
  selector: 'app-controls-current',
  imports: [
    FontAwesomeModule,
    NgIf,
    NgClass,
    ProgressBarComponent
],
  templateUrl: './controls-current.component.html',
  styleUrl: './controls-current.component.scss'
})
export class ControlsCurrentComponent {
  state = inject(StateService);

  faStepBackward = faStepBackward;
  faStepForward = faStepForward;
  faPlay = faPlay;
  faPause = faPause;
  faShuffle = faShuffle;
  faBars = faBars;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  faMusic = faMusic;
}
