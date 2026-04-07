'use client'

import { useState } from 'react'
import { PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface MediaPlayerProps {
  type: 'video' | 'audio'
  url: string
  title: string
  poster?: string
}

export function MediaPlayer({ type, url, title, poster }: MediaPlayerProps) {
  const t = useTranslations('LessonDetailPage')
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          {type === 'video' ? (
            <PlayIcon className="h-6 w-6 mr-2 text-indigo-600" />
          ) : (
            <SpeakerWaveIcon className="h-6 w-6 mr-2 text-indigo-600" />
          )}
          {type === 'video' ? t('videoLesson') : t('audioLesson')}
        </h2>

        {type === 'video' ? (
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
            
            {/* 🎥 الفيديو */}
            <video
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
            >
              <source src={url} />
            </video>

            {/* 🖼️ الصورة فوق الفيديو */}
            {!isPlaying && poster && (
              <div
                className="absolute top-0 left-0 w-full h-full cursor-pointer group"
                onClick={() => {
                  const video = document.querySelector('video')
                  video?.play()
                }}
              >
                <img
                  src={poster}
                  alt={title}
                  className="w-full h-full"
                />

                {/* ▶️ زر تشغيل */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition">
                  <PlayIcon className="h-16 w-16 text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <audio controls className="w-full">
              <source src={url} />
            </audio>
          </div>
        )}
      </div>
    </div>
  )
}