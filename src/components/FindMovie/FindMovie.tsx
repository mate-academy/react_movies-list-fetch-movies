import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

function searchMovie(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

type Props = {
  onAddToList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = props => {
  const { onAddToList } = props;
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    if (searchError) {
      setSearchError(false);
    }
  };

  const handleAddFilmButton = () => {
    onAddToList(movie as Movie);

    setInputValue('');
    setMovie(null);
  };

  const handleFindFilmButton = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!inputValue) {
      setSearchError(true);

      return;
    }

    getMovie(inputValue)
      .then(response => {
        if ((response as ResponseError).Response === 'False') {
          setSearchError(true);
          setMovie(null);

          return;
        }

        const newMovie = searchMovie(response as MovieData);

        setSearchError(false);
        setMovie(newMovie);
      })
      .finally(() => setLoading(false));
  };

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
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': searchError })}
              value={inputValue}
              onChange={handleChangeInput}
            />
          </div>

          {searchError && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              onClick={handleFindFilmButton}
              disabled={!inputValue.trim()}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddFilmButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!searchError && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">{movie.title}</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
