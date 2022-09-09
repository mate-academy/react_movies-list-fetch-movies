import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (m: Movie) => void,
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const onChangeTitle = (str: string) => {
    setTitle(str);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(title)
      .then((res) => {
        if ('Error' in res) {
          setError(true);
          setMovie(null);

          return;
        }

        const {
          Poster, Title, Plot, imdbID,
        } = res as MovieData;

        setMovie({
          title: Title,
          description: Plot === 'N/A' ? '' : Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      }).finally(() => setIsLoading(false));
  };

  const addMovieHandler = () => {
    if (movie) {
      addMovie(movie);
      onChangeTitle('');
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
              placeholder="Enter a title to search"
              className="input is-dander"
              value={title}
              onChange={(e) => {
                onChangeTitle(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={
                classNames('button is-light', { 'is-loading': isLoading })
              }
              disabled={title === ''}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
              >
                Add to the list
              </button>
            </div>
          )}
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
