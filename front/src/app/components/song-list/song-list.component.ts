import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { NgClass, NgIf } from '@angular/common';
import { Song } from '../../../types/music';

@Component({
  selector: 'app-song-list',
  imports: [
    NgIf,
    NgClass,
  ],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss'
})
export class SongListComponent {
  state = inject(StateService);

  handleSongSelect(song: Song) {
    this.state._currentSong.set(song);
    let index = this.state.songs().indexOf(this.state._currentSong()!);
    this.state.currentSongIndex.set(index);
    this.state.loadSong();
    this.state.audio().volume = 0.1;
    this.state.audio().play();
    this.state.isPlaying.set(true);
  }
}
