import React from 'react';
import './MovieCard.scss';

type Props = {
  movie: Movie | null;
  loading: boolean;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { movie, loading } = props;

  return (
    <div className="card">
      {!loading && (
        <>
          <div className="card-image" data-cy="card-image">

            <figure className="image is-4by3">
              <img
                src="https://dummyimage.com/800x600/000/fff"
                alt="Film logo"
              />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img
                    src="https://dummyimage.com/48x48/000/fff"
                    alt="imdb"
                  />
                </figure>
              </div>
              <div className="media-content">
                <p
                  className="title is-8"
                  data-cy="movie-title"
                >
                  {movie?.Title}
                </p>
              </div>
            </div>

            <div className="content" data-cy="content">
              {movie?.Plot}
              <br />
            </div>
          </div>
        </>
      )}

    </div>
  );
};
