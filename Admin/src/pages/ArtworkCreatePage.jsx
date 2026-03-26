import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createArtwork } from '../store/slices/artworkSlice';
import { useToast } from '../hooks/useToast';
import ArtworkForm from '../components/artwork/ArtworkForm';

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
    <div>
      <h1>Create Artwork</h1>
      <ArtworkForm onSubmit={handleSubmit} loading={formLoading} />
    </div>
  );
}