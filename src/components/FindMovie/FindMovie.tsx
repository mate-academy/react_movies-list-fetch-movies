import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (movie: Movie) => void,
  isRepeat: boolean,
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>,
};

export const FindMovie: React.FC<Props> = ({
  onMovieAdd,
  isRepeat,
  setIsRepeat,
}) => {
  const [query, setQuerie] = useState('');
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const findMovie = async () => {
    await getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(true);

          return;
        }

        const imgUrl = response.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster;

        setPreview({
          title: response.Title,
          description: response.Plot,
          imgUrl,
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        });
      })
      .catch(() => setError(true))
      .finally(() => setIsLoaded(false));
  };

  function handleInputChange(movieName: string) {
    setQuerie(movieName);
    setError(false);
    setIsRepeat(false);
  }

  function handleFindBtnClick(e: React.MouseEvent) {
    e.preventDefault();
    setPreview(null);
    setIsLoaded(true);
    setError(false);
    findMovie();
  }

  function handleAddBtnClick() {
    if (!preview) {
      return;
    }

    setPreview(null);
    setQuerie('');
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
              onChange={(e) => handleInputChange(e.target.value)}
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
              onClick={handleFindBtnClick}
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
              onClick={handleAddBtnClick}
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
