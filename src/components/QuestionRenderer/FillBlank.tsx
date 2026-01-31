'use client'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function FillBlank({ value, onChange }: Props) {
  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 border rounded-lg text-lg"
        placeholder="اكتب الإجابة هنا..."
      />
    </div>
  )
}
