import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-top-bar',
  imports: [NgIf],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  state = inject(StateService);

  handleSearch(event: any) {
    const target = event.target as HTMLInputElement;
    this.state.search.set(target.value);
  }
}