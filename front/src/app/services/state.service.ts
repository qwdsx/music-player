import { Injectable, signal } from '@angular/core';
import { Song } from '../../types/music';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  songs = signal<Song[]>([]);
  isPlaying = signal(false);
  currentSongIndex = signal(0);
  _currentSong = signal<Song | null>(null);
  audio = signal<HTMLAudioElement>(document.getElementsByTagName("audio")[0]);
  isCurrentOpen = signal(false);
  duration = signal(0);
  currentTime = signal(0);
  progress = signal(0);
  search = signal("");

  constructor() {}

  songsFiltered(): Song[] {
    return this.songs().filter(song => song.title.toLowerCase().includes(this.search().toLowerCase()));
  }

  handleOpenCurrentSong() {
    (this.isCurrentOpen()) ? this.isCurrentOpen.set(false) : this.isCurrentOpen.set(true);
  }

  handlePlayPause() {
    if (this.isPlaying()) {
      this.audio().pause();
      this.isPlaying.set(false);
    } else {
      this.audio().play();
      this.isPlaying.set(true);
    }
  }

  handleNext() {
    this.currentSongIndex.update(
      prev => (prev + 1 >= this.songs().length) ? 0 : prev + 1
    );
    this._currentSong.set(this.songs()[this.currentSongIndex()]);
    this.isPlaying.set(true);
    this.loadSong();
    this.audio().play();
  }

  handlePrevious() {
    this.currentSongIndex.update(
      prev => (prev - 1 < 0) ? this.songs().length - 1 : prev - 1
    );
    this._currentSong.set(this.songs()[this.currentSongIndex()]);
    this.isPlaying.set(true);
    this.loadSong();
    this.audio()?.play();
  }

  handleUpdateProgress() {
    if (!this.audio()) return;
    const duration = this.audio().duration || 1;
    const currentTime = this.audio().currentTime;
    this.duration.set(duration);
    this.currentTime.set(currentTime);
    this.progress.set(currentTime / duration);
  }

  loadSong() {
    let url = this.songs()[this.currentSongIndex()].url;
    this.audio().src = url;

    this.audio().addEventListener('timeupdate', this.handleUpdateProgress.bind(this));
    this.audio().addEventListener('ended', this.handleNext.bind(this));
    this.audio().addEventListener('error', () => {
      this.isPlaying.set(false);
    });
  }
}
