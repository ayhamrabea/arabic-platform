// components/media/MediaPlayer.tsx
import { PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'

interface MediaPlayerProps {
  type: 'video' | 'audio'
  url: string
  title: string
}

export function MediaPlayer({ type, url, title }: MediaPlayerProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          {type === 'video' ? (
            <PlayIcon className="h-6 w-6 mr-2 text-indigo-600" />
          ) : (
            <SpeakerWaveIcon className="h-6 w-6 mr-2 text-indigo-600" />
          )}
          {type === 'video' ? 'Video Lesson' : 'Audio Lesson'}
        </h2>
        
        {type === 'video' ? (
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
            <video controls className="absolute top-0 left-0 w-full h-full">
              <source src={url} />
            </video>
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