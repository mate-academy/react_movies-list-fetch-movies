import React from 'react';
import './MovieCard.scss';

type Props = {
  newMovie: Movie;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { newMovie } = props;

  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={newMovie.Poster}
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
            <p className="title is-8">{newMovie.Title}</p>
          </div>
        </div>

        <div className="content">
          {newMovie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
