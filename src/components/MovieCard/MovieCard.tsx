import React, { memo } from 'react';
import { Movie } from '../../types/Movie';
import { MoveCardImg } from './components/MoveCardImg';
import { MoveCardDescription } from './components/MoveCardDescription';
import './MovieCard.scss';

interface Props {
  movie: Movie;
}

export const MovieCard: React.FC<Props> = memo(
  ({ movie }) => (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <MoveCardImg
          alt="Film logo"
          url={movie.imgUrl}
          className="is-4by3"
          data-cy="moviePoster"
        />
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <MoveCardImg
              alt="imdb"
              className="is-48x48"
              url="images/imdb-logo.jpeg"
            />
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">
              {movie.title}
            </p>
          </div>
        </div>

        <MoveCardDescription
          imdbUrl={movie.imdbUrl}
          description={movie.description}
        />
      </div>
    </div>
  ),
);
