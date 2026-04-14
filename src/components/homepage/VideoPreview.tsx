'use client'

import { useState } from 'react'
import { PlayCircleIcon } from '@heroicons/react/24/outline'

export default function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative w-full group cursor-pointer">
      
      {/* الفيديو */}
      <video
        autoPlay
        muted
        loop
        controls
        playsInline
        preload="metadata"
        // poster="/soon.jpg"
        className="w-full rounded-2xl shadow-2xl"
      >
        <source src="0414.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      {!isPlaying && (
        <div
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl group-hover:bg-black/30 transition"
        >
          <div className="flex flex-col items-center gap-2">
            <PlayCircleIcon className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition" />
            <span className="text-white font-semibold text-sm sm:text-base">
              Смотреть как работает
            </span>
          </div>
        </div>
      )}
    </div>
  )
}