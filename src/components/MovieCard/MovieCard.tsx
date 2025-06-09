import React from 'react';
import { MovieData } from 'types';

interface Props {
  movie: MovieData;
}

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const placeholder = 'https://via.placeholder.com/150x220?text=No+Poster';

  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : placeholder}
        alt={movie.Title}
      />
      <div>
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </div>
  );
};
