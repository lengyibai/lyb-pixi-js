import { Assets } from "pixi.js";

/** @description 音频播放器
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiAudio-音频播放器
 */
export class LibPixiAudio {
  /** 是否启用音效 */
  effectEnabled = true;
  /** 是否启用音乐 */
  musicEnabled = true;

  /** 音乐是否处于暂停状态 */
  private _isMusicPaused = false;
  /** 是否已切换后台 */
  private _isBackground = false;
  /** 当前音乐播放器 */
  private _musicPlayer: HTMLAudioElement;
  /** 当前正在播放的音效列表 */
  private _playingList: { id: number; audio: HTMLAudioElement; url: string }[] =
    [];

  constructor() {
    this._musicPlayer = new Audio();
    document.addEventListener("visibilitychange", () => {
      this._isBackground = document.hidden;
      this._setPlayStatus(!document.hidden);
    });
  }

  /** @description 播放音效 */
  playEffect(link: string) {
    return new Promise<void>((resolve) => {
      const id = new Date().getTime();
      const url = Assets.get(link).url;
      const audio = new Audio(url);
      audio.muted = this._isBackground || !this.effectEnabled;

      audio.addEventListener("ended", () => {
        this._playingList = this._playingList.filter((item) => item.id !== id);
        resolve();
      });
      audio
        .play()
        .then(() => {
          this._playingList.push({
            id,
            audio,
            url,
          });
        })
        .catch(() => {});
    });
  }

  /** @description 播放音乐 */
  async playMusic(link: string) {
    //如果有音乐正在播放，则停止
    if (this._musicPlayer) {
      gsap.killTweensOf(this._musicPlayer);
      await gsap.to(this._musicPlayer, {
        volume: 0,
        duration: 1,
        ease: "linear",
      });
      this._musicPlayer.pause();
    }

    const url = Assets.get(link).url;
    this._musicPlayer.src = url;
    this._musicPlayer.loop = true;
    this._musicPlayer.volume = 0;

    const play = () => {
      this._musicPlayer
        .play()
        .then(() => {
          this._isMusicPaused = false;
          gsap.killTweensOf(this._musicPlayer);
          gsap.to(this._musicPlayer, {
            volume: 1,
            duration: 1,
            ease: "linear",
          });
        })
        .catch(() => {
          requestAnimationFrame(play.bind(this));
        });
    };
    play();
  }

  /** @description 暂停音乐，一般是为了停止音乐后播放指定的音效，音效结束后调用 resumeMusic */
  pauseMusic() {
    this._isMusicPaused = true;
    this._musicPlayer.pause();
  }

  /** @description 继续播放音乐，调用 pauseMusic 之后调用 */
  resumeMusic() {
    this._isMusicPaused = false;
    this._musicPlayer.play();
  }

  /** @description 停止播放指定音效 */
  stopEffect(link: string) {
    const url = Assets.get(link).url;
    this._playingList.forEach((item) => {
      if (item.url === url) {
        item.audio.pause();
      }
    });
    this._playingList = this._playingList.filter((item) => item.url !== url);
  }

  /** @description 设置启用音效 */
  setEffectEnabled(enabled: boolean) {
    this.effectEnabled = enabled;
    this._playingList.forEach((item) => {
      item.audio.muted = !enabled;
    });
  }

  /** @description 设置启用音乐 */
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    this._musicPlayer.muted = !enabled;
  }

  /** @description 设置音效和音乐播放状态 */
  private _setPlayStatus(status: boolean) {
    if (status) {
      !this._isMusicPaused && this._musicPlayer.play();
    } else {
      this._musicPlayer.pause();
    }

    this._playingList.forEach((item) => {
      if (status) {
        item.audio.play();
      } else {
        item.audio.pause();
      }
    });
  }
}
