export function DownloadLessonButton({
  pdfPath,
  disabled = false,
}: {
  pdfPath?: string | null
  disabled?: boolean
}) {
  if (!pdfPath) return null

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/lesson-files/${pdfPath}`

  return (
    <a
      href={fileUrl}
      target="_blank"
      download
      className={`px-4 py-2 rounded transition-colors ${
        disabled
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      Download PDF
    </a>
  )
}
