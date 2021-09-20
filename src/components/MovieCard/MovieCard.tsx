import React from 'react';
import './MovieCard.scss';

type Props = {
  currentMovie: Movie;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { currentMovie } = props;

  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={currentMovie.Poster}
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
            <p className="title is-8">{currentMovie.Title}</p>
          </div>
        </div>

        <div className="content">
          {currentMovie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
