import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie,
};

const setImage = (imageLink: string) : string => {
  if (imageLink === 'N/A') {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  return imageLink;
};

export const MovieCard: React.FC<Props> = ({ movie }) => (
  <div className="card" data-cy="movieCard">
    <div className="card-image">
      <figure className="image is-4by3">
        <img
          data-cy="moviePoster"
          src={setImage(movie.imgUrl)}
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
          <p className="title is-8" data-cy="movieTitle">{movie.title}</p>
        </div>
      </div>

      <div className="content" data-cy="movieDescription">
        {movie.description}
        <br />
        <a data-cy="movieURL" href={movie.imdbUrl}>
          IMDB
        </a>
      </div>
    </div>
  </div>
);
