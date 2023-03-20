import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie,
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const {
    imgUrl,
    title,
    description,
    imdbUrl,
  } = movie;

  const isTitle = (imgUrl !== 'N/A');
  // why we should use image from another server, but not from this program?
  // const posterDef = 'images/noPreview.png';
  const posterDef = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          {isTitle ? (
            <img
              data-cy="moviePoster"
              src={imgUrl}
              alt="Film logo"
            />
          ) : (
            <img
              data-cy="moviePoster"
              src={posterDef}
              alt="Film logo"
            />
          )}
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
