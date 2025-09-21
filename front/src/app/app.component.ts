import { Component, computed, OnInit, signal } from '@angular/core';
import { Song } from '../types/music';
import { env } from '../environments/env';
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
import { NgIf, NgClass } from '@angular/common';
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";

@Component({
  selector: 'app-root',
  imports: [
    FontAwesomeModule,
    NgIf,
    NgClass,
    ProgressBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'music-player';
  songs: Song[] = [];
  isPlaying = false;
  private currentSongIndex = signal(0);
  private _currentSong = signal<Song | null>(null);
  progress = signal(0);
  currentTime = signal(0);
  duration = signal(0);
  audio = document.getElementsByTagName("audio")[0];

  faStepBackward = faStepBackward;
  faStepForward = faStepForward;
  faPlay = faPlay;
  faPause = faPause;
  faShuffle = faShuffle;
  faBars = faBars;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  faMusic = faMusic;

  isCurrentSongOpen = false;
  search = signal("");

  songsSearched = computed(() =>
    this.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(this.search().toLowerCase())
    )
  );

  async ngOnInit() {
    this.fetchSongs();
    this.initialize();
    // window.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  initialize() {
    this.audio?.pause();
    this._currentSong.set(this.songs[this.currentSongIndex()]);
    this.audio = new Audio(this._currentSong()?.url);
    this.audio.volume = 0.1;
  }

  async fetchSongs() {
    let json = await fetch(`${env.apiUrl}`)
      .then((res) => res.json())
      .then((json) => json);
    this.songs = json;
  }

  get getSongs(): Song[] | null {
    return (this.songs) ? this.songs : null;
  }

  get getSongsSearched(): Song[] | null {
    return (this.songsSearched().length != 0) ? this.songsSearched() : this.songs;
  }

  get getCurrentSong(): Song | null {
    return (this.songs && this._currentSong) ? this._currentSong() : null;
  }

  handleSearch(event: any) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
    console.log(input.value);
  }

  handleSongSelect(song: Song) {
    this._currentSong.set(song);
    let index = this.songs.indexOf(this._currentSong()!);
    this.currentSongIndex.set(index);
    this.loadSong();
    this.audio.volume = 0.1;
    this.audio?.play();
    this.isPlaying = true;
  }

  updateProgress() {
    if (!this.audio) return;
    const duration = this.audio.duration || 1;
    const currentTime = this.audio.currentTime;
    this.duration.set(duration);
    this.currentTime.set(currentTime);
    this.progress.set(currentTime / duration);
  }

  handleIndexChange(i: number): number {
    return (i + 1 >= this.songs.length) ? 0 : i + 1;
  }

  next() {
    this.currentSongIndex.update(
      prev => (prev + 1 >= this.songs.length) ? 0 : prev + 1
    );
    this._currentSong.set(this.songs[this.currentSongIndex()]);
    this.isPlaying = true;
    this.loadSong();
    this.audio?.play();
  }

  previous() {
    this.currentSongIndex.update(
      prev => (prev - 1 <= 0) ? this.songs.length - 1 : prev - 1
    );
    this._currentSong.set(this.songs[this.currentSongIndex()]);
    this.isPlaying = true;
    this.loadSong();
    this.audio?.play();
  }

  loadSong() {
    let url = this.songs[this.currentSongIndex()].url;
    this.audio.src = url!;

    // Add existing event listeners
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.next.bind(this));
    this.audio.addEventListener('error', () => {
      this.isPlaying = false;
    });
  }

  handlePlayPause() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  handleOpenCurrentSong() {
    (this.isCurrentSongOpen) ? this.isCurrentSongOpen = false : this.isCurrentSongOpen = true;
  }

  // handleKeydown(event: KeyboardEvent) {
  //   switch (event.key) {
  //     case ' ':
  //       event.preventDefault();
  //       this.handlePlayPause();
  //       break;
  //     case 'c':
  //       event.preventDefault();
  //       this.handlePlayPause();
  //       break;
  //     case 'v':
  //       // this.handleNext();
  //       break;
  //     case 'z':
  //       // this.handlePrevious();
  //       break;
  //     case 'q':
  //       // this.increaseVolume();
  //       break;
  //     case 'a':
  //       // this.decreaseVolume();
  //       break;
  //     case 'm':
  //       // this.toggleMute();
  //       break;
  //   }
  // }
}
