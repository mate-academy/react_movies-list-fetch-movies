import React from 'react';
import { MovieData } from '../../types/MovieData';
import './MovieCard.scss';
import image from '../../img/360x270.png';

type Props = {
  film: MovieData | null,
};

export const MovieCard: React.FC<Props> = ({ film }) => {
  return (
    <div className="card" data-cy="movieCard">
      {
        film !== null && (
          <>
            <div className="card-image">
              <figure className="image is-4by3">
                <img
                  data-cy="moviePoster"
                  src={
                    film.Poster === 'N/A'
                      ? image
                      : film?.Poster
                  }
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
                  <p
                    className="title is-8"
                    data-cy="movieTitle"
                  >
                    {film.Title}
                  </p>
                </div>
              </div>

              <div className="content" data-cy="movieDescription">
                {film.Plot}
                <br />
                {/* <a href={movie.imdbUrl} data-cy="movieURL">
                  IMDB
                </a> */}
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};
