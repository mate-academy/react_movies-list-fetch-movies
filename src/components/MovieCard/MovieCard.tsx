import React from 'react';
import { MovieData } from '../../types/MovieData';
import './MovieCard.scss';

type Props = {
  movie: MovieData,
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const {
    Poster,
    Title,
    Plot,
    imdbID,
  } = movie;

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster}
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
            <p className="title is-8" data-cy="movieTitle">{Title}</p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {Plot}
          <br />
          <a href={`https://www.imdb.com/title/${imdbID}/`} data-cy="movieURL">
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
