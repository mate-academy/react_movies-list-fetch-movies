import React from 'react';
import { useLocalStorage } from '../../CustomHooks/useLocallStorage';

type Props = {
  movie: Movie;
  deleteMovie(movie: Movie): void;
  addMovie(movie: Movie): void;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { movie, deleteMovie, addMovie } = props;
  const [movies] = useLocalStorage<Movie[]>('Movies', []);
  const moviePoster = movie.Poster === 'N/A' ? 'http://www.terminy.info/assets/images/shargonizmi/not-found.jpg' : movie.Poster;

  return (
    <div className="card">
      <div className="card-header is-align-content-flex-end">
        {movies.findIndex(film => film.imdbID === movie.imdbID) !== -1
          ? (
            <button className="card-footer-item button is-danger is-light" type="button" onClick={() => deleteMovie(movie)}>
              Delete movie
            </button>
          ) : (
            <button className="card-footer-item button is-primary is-light" type="button" onClick={() => addMovie(movie)}>
              Add movie
            </button>
          )}
      </div>
      <div className="card-image">
        <figure className="image is-4by5">
          <img
            src={moviePoster}
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
