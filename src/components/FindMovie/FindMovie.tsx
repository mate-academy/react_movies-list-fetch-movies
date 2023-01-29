import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

const INITIAL_STATE: Movie = {
  title: '',
  description: '',
  imdbUrl: '',
  imgUrl: '',
  imdbId: '',
};

type Props = {
  addMovie: (movie: Movie) => void,
  isInList: (imdbId: string) => boolean,
};

export const FindMovie: React.FC<Props> = ({ addMovie, isInList }) => {
  const [movie, setMovie] = useState<Movie>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState('');

  const normalizeData = (data: MovieData): Movie => {
    const {
      Title, Plot, Poster, imdbID,
    } = data;
    const imdbUrl = `https://www.imdb.com/title/${imdbID}`;
    const imgUrl = (Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster);

    return {
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imgUrl,
      imdbUrl,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsFound(false);
    setIsTyping(false);
    setIsError(false);

    try {
      const dataFromServer = await getMovie(query);

      if ('Error' in dataFromServer) {
        setIsError(true);

        return;
      }

      const normalizedData = normalizeData(dataFromServer);

      setMovie(normalizedData);
      setIsFound(true);
    } catch {
      throw new Error('Failed movie load');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (movieToAdd: Movie) => {
    if (!isInList(movieToAdd.imdbId)) {
      addMovie(movieToAdd);
    }

    setMovie(INITIAL_STATE);
    setIsFound(false);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsTyping(true);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
            />
          </div>

          {(isError && !isTyping) && (
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
              className={cn(
                'button', 'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              {isFound ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {isFound && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAdd(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {isFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
