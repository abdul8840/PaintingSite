import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createArtwork } from '../store/slices/artworkSlice';
import { useToast } from '../hooks/useToast';
import ArtworkForm from '../components/artwork/ArtworkForm';
import { HiArrowLeft, HiPlus } from 'react-icons/hi';

export default function ArtworkCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { formLoading } = useSelector((state) => state.artworks);

  const handleSubmit = async (data) => {
    try {
      await dispatch(createArtwork(data)).unwrap();
      toast.success('Artwork created!');
      navigate('/artworks');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/artworks')}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 sm:mb-6 cursor-pointer"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base font-medium">Back to Artworks</span>
        </button>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                <HiPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Create New Artwork
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Add a new artwork to your collection
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black"></div>
          
          {/* Form Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <ArtworkForm onSubmit={handleSubmit} loading={formLoading} />
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 sm:mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            💡 <span className="font-medium">Tip:</span> Fill in all required fields marked with asterisk (*) to create your artwork successfully
          </p>
        </div>
      </div>
    </div>
  );
}