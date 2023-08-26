import { ref, type Ref } from 'vue'

export function usePlayer() {
  const player: Ref<HTMLAudioElement | null> = ref(null)

  async function stop() {
    const delay = 2000
    await fadeOutVolume(delay)
    player.value!.pause()
    player.value!.volume = 1
  }

  function fadeOutVolume(delay: number) {
    const originalVolume = player.value!.volume
    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        if (player.value!.volume <= 0.01) {
          player.value!.volume = 0
          clearInterval(interval)
          resolve()
        } else {
          player.value!.volume -= 0.01
        }
      }, delay / (originalVolume / 0.01))
    })
  }

  return { player, stop }
}
