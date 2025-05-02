import { memo } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type MoviesListProps = {
  movies: Movie[];
};

export const MoviesList = memo<MoviesListProps>(({ movies }) => (
  <div className="movies">
    {movies.length === 0 ? (
      <p className="no-movies-message">No movies added yet!</p>
    ) : (
      movies.map(movie => <MovieCard key={movie.imdbId} movie={movie} />)
    )}
  </div>
));

MoviesList.displayName = 'MoviesList';
