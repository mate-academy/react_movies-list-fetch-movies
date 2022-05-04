/* eslint-disable */
import React  from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  deleteMovie(movie: Movie): void;
}

export const MoviesList: React.FC<Props> = (props) => {
  const { movies, deleteMovie } = props;

  console.log('List', movies);

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          deleteMovie={deleteMovie}
        />
      ))}
    </div>
  );
};
