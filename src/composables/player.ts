import { type Ref, ref } from 'vue'

export function usePlayer() {
  const player: Ref<HTMLAudioElement | null> = ref(null)
  const currentTime = ref(0)

  function load() {
    player.value!.load()
  }

  function play() {
    player.value!.play()
  }

  async function stop() {
    const delay = 2000
    await fadeOutVolume(delay)
    player.value!.pause()
    player.value!.volume = 1
  }

  function fadeOutVolume(delay: number) {
    const originalVolume = player.value!.volume
    return new Promise<void>((resolve) => {
      const interval = setInterval(
        () => {
          if (player.value!.volume <= 0.01) {
            player.value!.volume = 0
            clearInterval(interval)
            resolve()
          } else {
            player.value!.volume -= 0.01
          }
        },
        delay / (originalVolume / 0.01),
      )
    })
  }

  function onTimeUpdate(callback: () => void) {
    player.value!.addEventListener('timeupdate', () => {
      currentTime.value = player.value!.currentTime
      callback()
    })
  }

  function onEnded(callback: () => void) {
    player.value!.addEventListener('ended', callback)
  }

  return {
    player,
    currentTime,
    load,
    play,
    stop,
    onTimeUpdate,
    onEnded,
  }
}
