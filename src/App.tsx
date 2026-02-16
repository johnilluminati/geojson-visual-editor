import './App.css'
import Header from './components/Header/Header'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="w-full">
        <div className="container mx-auto">
          <p>Hello World</p>
        </div>
      </main>
    </div>
  )
}

export default App
