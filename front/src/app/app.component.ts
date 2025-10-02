import { Component, inject, OnInit } from '@angular/core';
import { env } from '../environments/env';
import { NgIf, NgClass } from '@angular/common';
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { StateService } from './services/state.service';
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import { SongListComponent } from "./components/song-list/song-list.component";
import { ControlsBottomComponent } from "./components/controls-bottom/controls-bottom.component";
import { ControlsCurrentComponent } from './components/controls-current/controls-current.component';

@Component({
  selector: 'app-root',
  imports: [
    NgIf,
    NgClass,
    ProgressBarComponent,
    TopBarComponent,
    SongListComponent,
    ControlsBottomComponent,
    ControlsCurrentComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  state = inject(StateService);

  async ngOnInit() {
    this.fetchSongs();
    this.initialize();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  async fetchSongs() {
    let json = await fetch(`${env.apiUrl}`)
      .then((res) => res.json())
      .then((json) => json);
    this.state.songs.set(json);
  }

  initialize() {
    this.state.audio()?.pause();
    this.state._currentSong.set(this.state.songs()[this.state.currentSongIndex()]);
    this.state.audio.set(new Audio(this.state._currentSong()?.url));
    this.state.audio().volume = 0.1;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (document.activeElement === document.querySelector('#search')) return;
    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.state.handlePlayPause();
        break;
      case 'c':
        event.preventDefault();
        this.state.handlePlayPause();
        break;
      case 'v':
        event.preventDefault();
        this.state.handleNext();
        break;
      case 'z':
        event.preventDefault();
        this.state.handlePrevious();
        break;
      case 'q':
        // this.increaseVolume();
        break;
      case 'a':
        // this.decreaseVolume();
        break;
      case 'm':
        // this.toggleMute();
        break;
    }
  }

}
