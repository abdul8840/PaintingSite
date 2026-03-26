import { Link } from 'react-router-dom';
import { HiHome, HiShoppingBag, HiArrowLeft, HiSparkles } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rust/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold text-cream leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-xl flex items-center justify-center animate-float">
              <HiSparkles className="w-12 h-12 sm:w-16 sm:h-16 text-sage" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-4">
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-charcoal/60 mb-8 sm:mb-10 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved to a new location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link 
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-[0.98]"
          >
            <HiHome className="w-5 h-5" />
            Go Home
          </Link>
          <Link 
            to="/shop"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-ink border-2 border-ink rounded-xl font-semibold hover:bg-ink hover:text-white transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <HiShoppingBag className="w-5 h-5" />
            Browse Shop
          </Link>
        </div>

        {/* Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 mt-8 text-sm text-charcoal/60 hover:text-ink transition-colors cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>

        {/* Help Section */}
        <div className="mt-12 sm:mt-16 p-6 bg-white rounded-2xl border border-cream">
          <h3 className="font-semibold text-ink mb-2">Need Help?</h3>
          <p className="text-sm text-charcoal/60 mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-1 text-sm font-medium text-sage hover:text-sage/80 transition-colors cursor-pointer"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}