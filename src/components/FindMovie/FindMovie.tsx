import { PreviewMovie } from './components/PreviewMovie';
import { FindMovieForm } from './components/FindMovieForm';
import { FindMovieProps } from '../../types/FindMovie';

export const FindMovie: React.FC<FindMovieProps> = ({
  movie,
  setMovie,
  handleAddMovie,
}) => (
  <>
    <FindMovieForm
      movie={movie}
      setMovie={setMovie}
      handleAddMovie={handleAddMovie}
    />

    {movie && (
      <PreviewMovie movie={movie} />
    )}
  </>
);
