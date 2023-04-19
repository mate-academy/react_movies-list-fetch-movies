import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');

  const normalizeData = (data: MovieData | ResponseError) => {
    if ('Error' in data) {
      setErrorTitle(data.Error);

      return;
    }

    const newMovie: Movie = {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };

    setMovie(newMovie);
  };

  const onSunbmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const dataFromServer = await getMovie(query);

    try {
      normalizeData(dataFromServer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setErrorTitle('');
  };

  const handleAddMovie = (selectedMovie: Movie) => {
    addMovie(selectedMovie);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSunbmit}
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
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
            />
          </div>

          {errorTitle && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorTitle}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
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
