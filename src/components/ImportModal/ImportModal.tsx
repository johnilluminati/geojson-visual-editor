import { useRef, useState, type ComponentProps } from 'react'

export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (geojson: GeoJSON.FeatureCollection) => void
}

function parseAndValidate(input: string): GeoJSON.FeatureCollection | { error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch {
    return { error: 'Invalid JSON.' }
  }

  if (!parsed || typeof parsed !== 'object') {
    return { error: 'Input must be a JSON object.' }
  }

  const obj = parsed as Record<string, unknown>
  if (obj.type !== 'FeatureCollection') {
    return { error: 'GeoJSON must be a FeatureCollection (type: "FeatureCollection").' }
  }

  if (!Array.isArray(obj.features)) {
    return { error: 'FeatureCollection must have a "features" array.' }
  }

  return parsed as GeoJSON.FeatureCollection
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange: ComponentProps<'input'>['onChange'] = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result
      if (typeof content !== 'string') {
        setError('Could not read file as text.')
        return
      }
      const result = parseAndValidate(content.trim())
      if ('error' in result) {
        setError(result.error)
        return
      }
      onImport(result)
      handleClose()
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault()
    setError(null)

    const result = parseAndValidate(text.trim())
    if ('error' in result) {
      setError(result.error)
      return
    }

    onImport(result)
    setText('')
    setError(null)
    onClose()
  }

  const handleClose = () => {
    setText('')
    setError(null)
    fileInputRef.current && (fileInputRef.current.value = '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Import GeoJSON</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a file or paste your GeoJSON below. It must be a FeatureCollection.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".geojson,.json,application/geo+json,application/json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <label htmlFor="geojson-paste" className="text-sm font-medium text-gray-700">
            Or paste below
          </label>
          <textarea
            id="geojson-paste"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='{"type":"FeatureCollection","features":[...]}'
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={10}
            autoFocus
          />

          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
