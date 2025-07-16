'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React, { useRef } from 'react'
import { NextButton, PrevButton, usePrevNextButtons } from './ArrowButtons'
import { useAutoplayProgress } from './AutoplayProgress'
import { useAutoplay } from './Autoplay'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

type EmblaProps = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<EmblaProps> = ({ slides, options }) => {
  const progressNode = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 3000, playOnInit: false })
  ])

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi)

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode)

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {slides.map((index) => (
            <div key={index} className="flex-[0_0_70%] pl-4">
              <div className="bg-gray-800 text-white rounded-2xl h-80 flex items-center justify-center text-5xl font-bold shadow-inner">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 mt-6">
        <div className="grid grid-cols-2 gap-2">
          <PrevButton
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>

        <div
          className={`relative h-2 w-32 overflow-hidden rounded-full shadow-inner bg-zinc-700 transition-opacity duration-300 ${
            showAutoplayProgress ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            ref={progressNode}
            className="absolute top-0 bottom-0 left-[-100%] w-full bg-white animate-[autoplay-progress_3s_linear_forwards]"
          />
        </div>

        <button
          onClick={toggleAutoplay}
          className="px-4 py-1 rounded-full font-bold text-sm shadow-inner border border-zinc-400 bg-zinc-800 text-white"
        >
          {autoplayIsPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default EmblaCarousel
