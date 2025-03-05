import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  setMovies: (value: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  title,
  setTitle,
  setMovies,
  movies,
}) => {
  const hasTitle = title === '';
  const [movieFound, setMovieFound] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMovieSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      const searchResult = await getMovie(title);

      if ('Error' in searchResult) {
        setError("Can't find a movie with such a title");

        return;
      } else {
        setMovieFound({
          ...searchResult,
          title: searchResult.Title,
          description: searchResult.Plot,
          imgUrl:
            searchResult.Poster && searchResult.Poster !== 'N/A'
              ? searchResult.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${searchResult.imdbID}`,
          imdbId: searchResult.imdbID,
        });
      }
    } catch {
      setError('Unexpected error occured');
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setMovieFound(null);
    setTitle('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTitle(event.target.value);
  };

  const handleAddToList = () => {
    if (!movieFound) {
      return;
    }

    const duplicateCheck = movies.find(
      movie => movie.imdbId === movieFound.imdbId,
    );

    if (duplicateCheck) {
      clearData();
    } else {
      setMovies([...movies, movieFound]);
      clearData();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          handleMovieSearch(e);
        }}
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
              value={title}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={e => handleInputChange(e)}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={hasTitle}
            >
              Find a movie
            </button>
          </div>

          {movieFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFound} />
        </div>
      )}
    </>
  );
};
