import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworks } from '../store/slices/artworkSlice';
import categoryApi from '../api/categoryApi';
import { useState } from 'react';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.artworks);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    categoryApi.getBySlug(slug).then(res => setCategory(res.category)).catch(() => {});
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
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: category?.name || slug }]} />
      <h1>{category?.name || 'Category'}</h1>
      {category?.description && <p>{category.description}</p>}
      <ArtworkGrid artworks={items} loading={loading} />
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}