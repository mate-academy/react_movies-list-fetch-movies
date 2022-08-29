import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (movie: Movie) => void,
  isRepeat: boolean,
  setRepeat: (ans: boolean) => void,
};

export const FindMovie: React.FC<Props> = ({
  onMovieAdd,
  isRepeat,
  setRepeat,
}) => {
  const [query, setQueries] = useState('');
  const [error, setError] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const findMovie = async () => {
    const newMovie = await getMovie(query);

    if ('Error' in newMovie) {
      setError(true);
      setLoaded(false);

      return;
    }

    const imgUrl = newMovie.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : newMovie.Poster;

    const movie = {
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl,
      imdbId: newMovie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
    };

    setPreview(movie);
    setLoaded(false);
  };

  function handleInput(movieName: string) {
    setQueries(movieName);
    setError(false);
    setRepeat(false);
  }

  function handleFindBtn(e: React.MouseEvent) {
    e.preventDefault();
    setPreview(null);
    setLoaded(true);
    setError(false);
    findMovie();
  }

  function handleAddBtn() {
    if (!preview) {
      return;
    }

    setPreview(null);
    setQueries('');
    onMovieAdd(preview);
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              onChange={(e) => handleInput(e.target.value)}
            />
          </div>
          {(error && query)
            && (
              <p
                className="help is-danger"
                data-cy="errorMessage"
              >
                Can&apos;t find a movie with such a title
              </p>
            )}
          {isRepeat
            && (
              <p
                className="help is-danger"
                data-cy="errorMessage"
              >
                This movie already exists in the MovieList
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={query === ''}
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoaded,
                },
              )}
              onClick={handleFindBtn}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary button"
              style={
                preview
                  ? { opacity: 1, transition: '0.5s' }
                  : { opacity: 0, transition: '0.3s', cursor: 'default' }
              }
              onClick={handleAddBtn}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={preview} />
      </div>
    </>
  );
};
