"use client";

import React, { useRef, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { NextButton, PrevButton, usePrevNextButtons } from "./ArrowButtons";
import { useAutoplay } from "./Autoplay";
import { useAutoplayProgress } from "./AutoplayProgress";
import Autoplay from "embla-carousel-autoplay";

type CarouselProps = {
  options?: EmblaOptionsType;
  children: ReactNode[];
};

const Carousel: React.FC<CarouselProps> = ({ options, children }) => {
  const progressNode = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 5000, playOnInit: true }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi);

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode);

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {children.map((child, index) => (
            <div key={index} className="flex-[0_0_70%] pl-4 min-w-0">
              {child}
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
          className={`relative h-2 w-32 overflow-hidden rounded-full bg-zinc-700 ${
            showAutoplayProgress ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={progressNode} className="autoplay-progress-bar" />
        </div>

        <button
          onClick={toggleAutoplay}
          className="px-4 py-1 rounded-full font-bold text-sm shadow-inner border border-zinc-400 bg-zinc-800 text-white"
        >
          {autoplayIsPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default Carousel;
