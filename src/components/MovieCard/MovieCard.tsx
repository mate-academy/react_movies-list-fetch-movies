import React from 'react';
import { Movie } from '../../types/Movie';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie }) => (
  <div data-cy="movieCard" className="movie-card">
    <h3 data-cy="movieTitle">{movie.title}</h3>
    <img data-cy="moviePoster" src={movie.imgUrl} alt={movie.title} />
    <p data-cy="movieDescription">{movie.description}</p>
    <a
      data-cy="movieURL"
      href={movie.imdbUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      More on IMDb
    </a>
  </div>
);
