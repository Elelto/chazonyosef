import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            הדף לא נמצא
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            מצטערים, הדף שחיפשת אינו קיים או הועבר למיקום אחר.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="inline ml-2" size={20} />
              חזרה לדף הבית
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              <ArrowRight className="inline ml-2" size={20} />
              חזור לדף הקודם
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
