import React from 'react';
import type { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

const DEFAULT_BEST_CAT_IMG_URL =
  // eslint-disable-next-line max-len
  //'https://static-third-res.wondershare.cc/Media_io/aicommunity/thumbs/static/s7/c7ebffc7ef8faff50b28163640d503aa.jpg?x-oss-process=image%2Fresize%2Cm_lfit%2Cw_560%2Fformat%2Cjpg%2Fquality%2Cq_80';
  'https://media.tenor.com/SIivQgIKO5wAAAAe/absolute-cinema.png';

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const image = event.currentTarget;

    if (image.src !== DEFAULT_BEST_CAT_IMG_URL) {
      image.src = DEFAULT_BEST_CAT_IMG_URL; // ccc in search
    }
  };

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={movie.imgUrl}
            alt="Film logo"
            onError={handleImageError}
          />
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
              {movie.title}
            </p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movie.description}
          <br />
          <a href={movie.imdbUrl} data-cy="movieURL">
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
