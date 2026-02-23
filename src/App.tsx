import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import ImportModal from './components/ImportModal/ImportModal'
import MapPanel from './components/MapPanel/MapPanel'

function App() {
  const [geojson, setGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="container mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Import
          </button>
        </div>
      </div>
      <main className="min-h-0 flex-1 w-full">
        <div className="container mx-auto h-full px-4 py-4">
          <MapPanel geojson={geojson} />
        </div>
      </main>
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={setGeoJSON}
      />
    </div>
  )
}

export default App
