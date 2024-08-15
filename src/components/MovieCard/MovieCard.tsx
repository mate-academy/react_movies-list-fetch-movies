import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const showImage = (url: string) => {
    if (url === 'N/A') {
      return 'https://via.placeholder.com/360x270.png?text=no%20preview';
    }

    return url;
  };

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={showImage(movie.imgUrl)}
            alt="Film logo"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src="images/imdb-logo.jpeg" alt="imdb" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">
              {movie.title}
            </p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movie.description}
          <br />
          <a
            href={movie.imdbUrl}
            target="_blank"
            data-cy="movieURL"
            rel="noreferrer"
          >
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
