import './App.css'
import Header from './components/Header/Header'
import MapPanel from './components/MapPanel/MapPanel'

function App() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="min-h-0 flex-1 w-full">
        <div className="container mx-auto h-full px-4 py-4">
          <MapPanel />
        </div>
      </main>
    </div>
  )
}

export default App
