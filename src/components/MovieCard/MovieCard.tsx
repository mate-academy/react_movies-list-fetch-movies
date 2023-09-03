import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie,
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const {
    imgUrl, imdbUrl, description, title,
  } = movie;
  const DEFAULT_POSTER
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  const properPoster = imgUrl === 'N/A' ? DEFAULT_POSTER : imgUrl;

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={properPoster}
            alt={title}
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img
                src="images/imdb-logo.jpeg"
                alt="imdb"
              />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">{title}</p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {description}
          <br />
          <a href={imdbUrl} data-cy="movieURL">
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
