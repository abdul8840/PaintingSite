import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworks } from '../store/slices/artworkSlice';
import categoryApi from '../api/categoryApi';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiCollection, HiFilter } from 'react-icons/hi';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.artworks);
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    setCategoryLoading(true);
    categoryApi.getBySlug(slug)
      .then(res => setCategory(res.category))
      .catch(() => {})
      .finally(() => setCategoryLoading(false));
  }, [slug]);

  useEffect(() => {
    if (category) {
      const params = new URLSearchParams(searchParams);
      params.set('category', category._id);
      dispatch(fetchArtworks(params.toString()));
    }
  }, [dispatch, category, searchParams]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[
            { label: 'Shop', href: '/shop' }, 
            { label: category?.name || slug }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="animate-fade-in-up">
            {categoryLoading ? (
              <div className="animate-pulse">
                <div className="h-8 sm:h-10 bg-cream rounded-lg w-1/3 mb-4" />
                <div className="h-4 bg-cream rounded w-2/3" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center">
                    <HiCollection className="w-6 h-6 sm:w-7 sm:h-7 text-sage" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
                    {category?.name || 'Category'}
                  </h1>
                </div>
                
                {category?.description && (
                  <p className="text-base sm:text-lg text-charcoal/70 max-w-3xl leading-relaxed">
                    {category.description}
                  </p>
                )}
                
                {pagination?.total > 0 && (
                  <p className="mt-4 text-sm text-charcoal/50">
                    Showing {items.length} of {pagination.total} artworks
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Artworks Grid */}
        <div className="animate-fade-in-up stagger-1">
          <ArtworkGrid artworks={items} loading={loading} />
        </div>
        
        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCollection className="w-10 h-10 text-mist" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">No Artworks Found</h3>
            <p className="text-charcoal/60 mb-6">There are no artworks in this category yet.</p>
            <a 
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 cursor-pointer"
            >
              Browse All Artworks
            </a>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-10 sm:mt-12 flex justify-center animate-fade-in-up stagger-2">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}