import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworkById, updateArtwork, clearCurrent } from '../store/slices/artworkSlice';
import { useToast } from '../hooks/useToast';
import ArtworkForm from '../components/artwork/ArtworkForm';
import Loader from '../components/common/Loader';

export default function ArtworkEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { current, loading, formLoading } = useSelector((state) => state.artworks);

  useEffect(() => {
    dispatch(fetchArtworkById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    try {
      await dispatch(updateArtwork({ id, data })).unwrap();
      toast.success('Artwork updated!');
      navigate('/artworks');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !current) return <Loader />;

  return (
    <div>
      <h1>Edit Artwork</h1>
      <ArtworkForm initialData={current} onSubmit={handleSubmit} loading={formLoading} />
    </div>
  );
}