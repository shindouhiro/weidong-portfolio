export function useCardSpotlight() {
  function handleCardMouseMove(e: MouseEvent) {
    const card = (e.currentTarget as HTMLElement) || (e.target as HTMLElement)?.closest('.spotlight-card')
    if (!card)
      return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    // Subtle 3D tilt (-6 to 6 deg)
    const tiltX = ((y / rect.height) - 0.5) * -8
    const tiltY = ((x / rect.width) - 0.5) * 8

    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
    card.style.setProperty('--mouse-percent-x', `${percentX}%`)
    card.style.setProperty('--mouse-percent-y', `${percentY}%`)
    card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
  }

  function handleCardMouseLeave(e: MouseEvent) {
    const card = (e.currentTarget as HTMLElement) || (e.target as HTMLElement)?.closest('.spotlight-card')
    if (!card)
      return

    card.style.setProperty('--tilt-x', '0deg')
    card.style.setProperty('--tilt-y', '0deg')
    card.style.setProperty('--mouse-x', '-999px')
    card.style.setProperty('--mouse-y', '-999px')
  }

  return {
    handleCardMouseMove,
    handleCardMouseLeave,
  }
}
