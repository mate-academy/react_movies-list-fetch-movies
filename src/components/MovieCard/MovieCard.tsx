import React from 'react';

type Props = {
  movie: Movie;
  deleteMovie(movie: Movie): void;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { movie, deleteMovie } = props;

  return (
    <div className="card">
      <div className="card-header is-align-content-flex-end">
        <button className="card-footer-item button is-danger is-light" type="button" onClick={() => deleteMovie(movie)}>
          Delete movie
        </button>
      </div>
      <div className="card-image">
        <figure className="image is-4by5">
          <img
            src={movie.Poster}
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
            <p className="title is-8">{movie.Title}</p>
          </div>
        </div>

        <div className="content">
          {movie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
