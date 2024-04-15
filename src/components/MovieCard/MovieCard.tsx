import React from 'react';
import './MovieCard.scss';

import { Movie } from '../../types/Movie';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie: preview }) => {
  const [poster, setPoster] = React.useState<string>(preview.Poster);
  const defaultPoster =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handlePosterError = () => {
    setPoster(defaultPoster);
  };

  return (
    <>
      {preview && (
        <div className="card" data-cy="movieCard">
          <div className="card-image">
            <figure className="image is-4by3">
              <img
                data-cy="moviePoster"
                src={poster}
                onError={handlePosterError}
                alt="Film logo"
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
                  {preview.Title}
                </p>
              </div>
            </div>

            <div className="content" data-cy="movieDescription">
              {preview.Plot}
              <br />
              <a
                href={`https://www.imdb.com/title/${preview.imdbID}`}
                data-cy="movieURL"
              >
                IMDB
              </a>
              с
            </div>
          </div>
        </div>
      )}
    </>
  );
};
