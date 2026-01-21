import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  moviePreview: Movie;
};

export const MovieCard: React.FC<Props> = ({ moviePreview }) => (
  <div className="card" data-cy="movieCard">
    <div className="card-image">
      <figure className="image is-4by3">
        <img data-cy="moviePoster" src={moviePreview.imgUrl} alt="Film logo" />
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
            {moviePreview.title}
          </p>
        </div>
      </div>

      <div className="content" data-cy="movieDescription">
        {moviePreview.description}
        <br />
        <a href={moviePreview.imdbUrl} data-cy="movieURL">
          IMDB
        </a>
      </div>
    </div>
  </div>
);
