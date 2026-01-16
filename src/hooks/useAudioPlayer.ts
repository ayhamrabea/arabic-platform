export function useAudioPlayer() {
  const play = (url?: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!url) return
    new Audio(url).play()
  }

  return { play }
}
