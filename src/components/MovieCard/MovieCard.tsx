import React from 'react';
import './MovieCard.scss';

type Props = {
  movie: MovieApi;
};

export const MovieCard: React.FC<Props> = ({ movie }) => (
  <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img
          src={movie.imgUrl}
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
          <p className="title is-8">{movie.title}</p>
        </div>
      </div>

      <div className="content">
        {movie.description}
        <br />
        <a href={`https://www.imdb.com/title/${movie.imdbId}`}>IMDB</a>
      </div>
    </div>
  </div>
);
