/* eslint-disable no-console */
import React from 'react';
import './MovieCard.scss';

type Props = {
  movie: Movie | null;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { movie } = props;

  return (movie && (
    <a
      href={`https://duckduckgo.com/?q=!ducky+${movie.Title}+watch+online`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src={movie.Poster}
              alt="Film logo"
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
              <p className="title is-8">{movie.Title}</p>
            </div>
          </div>
          <div className="content">
            {movie.Plot}
            <br />
          </div>
        </div>
      </div>
    </a>
  ));
};
