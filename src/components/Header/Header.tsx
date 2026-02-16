import { FcGlobe } from "react-icons/fc";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FcGlobe className="text-2xl shrink-0" />
          <span className="text-xl sm:text-2xl font-semibold">GeoJSON Visual Editor</span>
        </div>
      </div>
    </header>
  )
}

export default Header