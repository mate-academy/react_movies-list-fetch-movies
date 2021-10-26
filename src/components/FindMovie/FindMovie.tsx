import { useState } from 'react';
import { request } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  setMovies: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchFail, setSearchFail] = useState(false);

  const searchMovie = () => {
    request(search)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setMovie(null);
          setSearch('');
          setSearchFail(true);
        } else {
          setMovie(newMovie);
          setSearchFail(false);
        }
      });
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    setMovies(movie as Movie);
    setMovie(null);
    setSearch('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearchFail(false);
                }}
              />
            </div>
          </label>

          {searchFail && (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
