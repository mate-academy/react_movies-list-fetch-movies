import { useState } from 'react';
import { request } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (value: Movie[]) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [value, changeValue] = useState('');
  const [movie, changeMovie] = useState<Movie | null>();
  const [findMovie, undefinedMovie] = useState<Movie | null>();

  const finder = () => {
    const getMovie = () => request(`t=${value}`);

    getMovie()
      .then((result: Movie) => {
        undefinedMovie(null);
        changeMovie(result);
      });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input"
                onChange={event => changeValue(event.target.value)}
              />
            </div>
          </label>
          {findMovie && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={finder}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!findMovie && movie) {
                  const elemOfMovie = [...movies].map(mov => mov.imdbID);

                  if (!elemOfMovie.includes(movie.imdbID)) {
                    addMovie([...movies, movie]);
                    changeValue('');
                    changeMovie(null);
                  }
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
        <div className="container">
          <h2 className="title">Preview</h2>
          {!findMovie && movie && (
            <MovieCard movie={movie} />
          )}
        </div>
      </form>
    </>
  );
};
