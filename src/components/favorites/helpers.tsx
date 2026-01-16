
export const getLevelColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800'
    
    const colors: Record<string, string> = {
        'A1': 'bg-green-100 text-green-800',
        'A2': 'bg-blue-100 text-blue-800',
        'B1': 'bg-yellow-100 text-yellow-800',
        'B2': 'bg-orange-100 text-orange-800',
        'C1': 'bg-red-100 text-red-800',
        'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
}


export const getDifficultyColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800'
    if (score <= 3) return 'bg-green-100 text-green-800'
    if (score <= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}
