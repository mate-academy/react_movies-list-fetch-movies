import React from 'react';
import './MovieCard.scss';
import { Movie } from '../../types/Movie';
import { defaultMovieProps } from '../../utils/defaultMovieProps';

type Props = {
  movie?: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie = defaultMovieProps }) => {
  const {
    title, description, imgUrl, imdbUrl,
  } = movie;

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          {imgUrl && (
            <img
              data-cy="moviePoster"
              src={imgUrl}
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
            {title && (
              <p className="title is-8" data-cy="movieTitle">
                {title}
              </p>
            )}
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {description}
          <br />
          {imdbUrl && (
            <a href={imdbUrl} data-cy="movieURL">
              IMDB
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

MovieCard.defaultProps = {
  movie: defaultMovieProps,
};
