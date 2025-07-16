'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'

export const useAutoplayProgress = <T extends HTMLElement>(
  emblaApi: EmblaCarouselType | undefined,
  progressNode: React.RefObject<T | null>
) => {
  const [showAutoplayProgress, setShowAutoplayProgress] = useState(false)
  const animationName = useRef('')
  const timeoutId = useRef(0)
  const rafId = useRef(0)

  const startProgress = useCallback((timeUntilNext: number | null) => {
    const node = progressNode.current
    if (!node || timeUntilNext === null) return
    if (!animationName.current) {
      animationName.current = window.getComputedStyle(node).animationName
    }

    node.style.animationName = 'none'
    node.style.transform = 'translate3d(0,0,0)'

    rafId.current = window.requestAnimationFrame(() => {
      timeoutId.current = window.setTimeout(() => {
        node.style.animationName = animationName.current
        node.style.animationDuration = `${timeUntilNext}ms`
      }, 0)
    })

    setShowAutoplayProgress(true)
  }, [progressNode])

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return
    emblaApi
      .on('autoplay:timerset', () => startProgress(autoplay.timeUntilNext()))
      .on('autoplay:timerstopped', () => setShowAutoplayProgress(false))
  }, [emblaApi, startProgress])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafId.current)
      clearTimeout(timeoutId.current)
    }
  }, [])

  return { showAutoplayProgress }
}
