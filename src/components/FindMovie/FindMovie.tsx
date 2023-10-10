import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  addMovie: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [titleMovie, setTitleMovie] = useState('');
  const [errorMessageMovies, setErrorMessageMovies] = useState('');
  const [submitSpiner, setSubmitSpiner] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitSpiner(true);
    getMovie(titleMovie).then(response => {
      if ('Error' in response) {
        // eslint-disable-next-line
        throw 'Error from server!';
      }

      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    })
      .catch(() => setErrorMessageMovies('Can\'t find a movie with such a title'))
      .finally(() => setSubmitSpiner(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleMovie(e.target.value);
    setErrorMessageMovies('');
  };

  const handleAdd = (mov: Movie) => {
    if (movies.some((movi) => movi.title === mov.title)) {
      setMovie(null);
    } else {
      addMovie([...movies, mov]);
      setMovie(null);
    }
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
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              name="t"
              placeholder="Enter a title to search"
              className="input"
              value={titleMovie}
              onChange={handleChange}
            />
          </div>

          {
            errorMessageMovies && (
              <p className="help is-danger" data-cy="errorMessage">
                {errorMessageMovies}
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={submitSpiner ? 'button is-light is-loading'
                : 'button is-light'}
              disabled={
                !titleMovie.trim()
              }
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {
            movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => handleAdd(movie)}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
