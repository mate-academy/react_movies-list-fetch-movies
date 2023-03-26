import { memo } from 'react';
import { Movie } from '../../../../types/Movie';
import { MovieCard } from '../../../MovieCard';

interface Props {
  movie: Movie;
}

export const PreviewMovie: React.FC<Props> = memo(
  ({ movie }) => (
    <div className="container" data-cy="previewContainer">
      <h2 className="title">Preview</h2>
      {movie && (
        <MovieCard
          movie={movie}
        />
      )}
    </div>
  ),
);
