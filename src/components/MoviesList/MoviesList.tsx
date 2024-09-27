import { FC, memo } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types';

type Props = {
  movies: Movie[];
};

export const MoviesList: FC<Props> = memo(({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId} movie={movie} />
    ))}
  </div>
));
