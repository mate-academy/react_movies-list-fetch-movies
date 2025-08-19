import React, { useState } from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

interface Props {
  movie: Movie;
}

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const [imgSrc, setImgSrc] = useState(
    movie.imgUrl === 'N/A'
      ? 'https://via.placeholder.com/300x450?text=No+Image'
      : movie.imgUrl,
  );
  const handleImageError = () => {
    setImgSrc('https://via.placeholder.com/300x450?text=No+Image');
  };

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={imgSrc}
            alt={movie.title}
            onError={handleImageError}
          />
        </figure>
      </div>
      <div className="media-content">
        <p className="title is-8" data-cy="movieTitle">
          {movie.title}
        </p>
      </div>
      <div className="content" data-cy="movieDescription">
        {movie.description}
        <a
          href={`${movie.imdbUrl}/`}
          data-cy="movieURL"
          target="_blank"
          rel="noreferrer"
        >
          IMDB
        </a>
      </div>
    </div>
  );
};
