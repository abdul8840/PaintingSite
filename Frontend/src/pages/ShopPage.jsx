import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworks, fetchFilterOptions } from '../store/slices/artworkSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import ArtworkFilters from '../components/artwork/ArtworkFilters';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, pagination, loading, filters } = useSelector((state) => state.artworks);
  const { items: categories } = useSelector((state) => state.categories);

  const currentFilters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    dispatch(fetchFilterOptions());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchArtworks(searchParams.toString()));
  }, [dispatch, searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(newFilters);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Shop' }]} />
      <h1>Art Gallery</h1>

      {/* Category Quick Links */}
      <div>
        <button onClick={() => handleFilterChange({})} data-active={!currentFilters.category}>All</button>
        {categories.map((cat) => (
          <button key={cat._id} onClick={() => handleFilterChange({ ...currentFilters, category: cat._id })} data-active={currentFilters.category === cat._id}>
            {cat.name}
          </button>
        ))}
      </div>

      <div>
        <ArtworkFilters filters={filters} currentFilters={currentFilters} onFilterChange={handleFilterChange} />
        <div>
          {currentFilters.search && <p>Search results for: "{currentFilters.search}"</p>}
          <ArtworkGrid artworks={items} loading={loading} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}