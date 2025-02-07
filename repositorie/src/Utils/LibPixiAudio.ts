import { Assets } from "pixi.js";
import { Howl } from "howler";
import "@pixi/sound";
import gsap from "gsap";

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
  private _musicPlayer?: Howl;
  /** 当前正在播放的音效列表 */
  private _playingList: { id: number; audio: Howl; url: string }[] = [];

  constructor() {
    document.addEventListener("visibilitychange", () => {
      this._isBackground = document.hidden;
      this._setPlayStatus(!document.hidden);
    });
  }

  /** @description 播放音效
   * @param key 音效资源Key，内部会使用Assets.get(key)获取音频资源
   * @param end 倒数几秒位置播放，单位秒
   */
  playEffect(key: string, end?: number) {
    return new Promise<void>((resolve) => {
      const id = new Date().getTime();
      const url = Assets.get(key).url;
      const sound = new Howl({
        src: url,
        mute: this._isBackground || !this.effectEnabled,
      });
      sound.play();

      sound.on("end", () => {
        this._playingList = this._playingList.filter((item) => item.id !== id);
        resolve();
      });

      //倒数几秒位置播放
      if (end) {
        const duration = sound.duration();
        const start = duration - end;
        sound.seek(start);
      }
      this._playingList.push({
        id,
        audio: sound,
        url,
      });
    });
  }

  /** @description 播放音乐
   * @param key 音效资源Key，内部会使用Assets.get(key)获取音频资源
   */
  async playMusic(key: string) {
    const url = Assets.get(key).url;
    //如果有音乐正在播放，则停止
    if (this._musicPlayer) {
      gsap.killTweensOf(this._musicPlayer);
      await gsap.to(this._musicPlayer, {
        volume: 0,
        duration: 1,
        ease: "linear",
      });
      this._musicPlayer.stop();
    }

    this._musicPlayer = new Howl({
      src: url,
      loop: true,
      volume: 0,
      html5: true,
      mute: this._isBackground || !this.effectEnabled,
    });

    this._musicPlayer.play();
    this._isMusicPaused = false;
    gsap.killTweensOf(this._musicPlayer);
    gsap.to(this._musicPlayer, {
      volume: 1,
      duration: 1,
      ease: "linear",
    });
  }

  /** @description 暂停音乐 */
  pauseMusic() {
    this._isMusicPaused = true;
    this._musicPlayer?.pause();
  }

  /** @description 继续播放音乐 */
  resumeMusic() {
    this._isMusicPaused = false;
    this._musicPlayer?.play();
  }

  /** @description 停止播放指定音效
   * @param key 音效资源Key，内部会使用Assets.get(key)获取音频资源进行停止
   */
  stopEffect(key: string) {
    const url = Assets.get(key).url;
    this._playingList.forEach((item) => {
      if (item.url === url) {
        item.audio.pause();
      }
    });
    this._playingList = this._playingList.filter((item) => item.url !== url);
  }

  /** @description 设置启用音效
   * @param enabled 启用状态，false为禁用
   */
  setEffectEnabled(enabled: boolean) {
    this.effectEnabled = enabled;
    this._setEffectMute(!enabled);
  }

  /** @description 设置启用音乐
   * @param enabled 启用状态，false为禁用
   */
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    this._setMusicMute(!enabled);
  }

  /** @description 设置音效和音乐播放状态
   * @param status 播放状态，false为暂停
   */
  private _setPlayStatus = (status: boolean) => {
    if (status) {
      !this._isMusicPaused && this._musicPlayer?.play();
    } else {
      this._musicPlayer?.pause();
    }

    this._playingList.forEach((item) => {
      if (status) {
        item.audio.play();
      } else {
        item.audio.pause();
      }
    });
  };

  /** @description 设置静音音乐
   * @param disabled 静音状态，true为静音
   */
  private _setMusicMute(disabled: boolean) {
    this._musicPlayer?.mute(disabled || !this.musicEnabled);
  }

  /** @description 设置静音音效
   * @param disabled 静音状态，true为静音
   */
  private _setEffectMute(disabled: boolean) {
    this._playingList.forEach((item) => {
      item.audio.mute(disabled || !this.effectEnabled);
    });
  }
}
