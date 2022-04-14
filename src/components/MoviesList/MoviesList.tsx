import { FC, memo, useContext } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MoviesContext } from '../MoviesContext';

export const MoviesList: FC = memo(() => {
  const { storedMovies } = useContext(MoviesContext);

  return (
    <div className="movies">
      {storedMovies.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
});
