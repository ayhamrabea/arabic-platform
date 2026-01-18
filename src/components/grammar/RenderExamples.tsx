import { GrammarRule } from "@/store/apis/lessonsApi"

export const renderExamples = (rule:GrammarRule) => {
    if (!rule.examples) return null

    if (typeof rule.examples === 'string') {
      return rule.examples
    }

    if (Array.isArray(rule.examples)) {
      return (
        <div className="space-y-2">
          {rule.examples.map((ex: string, index: number) => (
            <div key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{ex}</span>
            </div>
          ))}
        </div>
      )
    }

    return (
      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
        {JSON.stringify(rule.examples, null, 2)}
      </pre>
    )
  }
