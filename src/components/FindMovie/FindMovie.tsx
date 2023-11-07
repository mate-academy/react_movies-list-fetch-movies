import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[]
  addMovie: (newMovies: Movie[]) => void
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [isError, setIsError] = useState(false);
  const [isVisibleMovieCard, setIsVisibleMovieCard] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>({
    title: 'Title',
    description: 'Plot',
    imgUrl: 'Poster',
    imdbUrl: 'imdbUrl',
    imdbId: 'imdbID',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setInputValue(event.target.value);
  };

  const handleSearchBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(inputValue).then((result) => {
      if ('Error' in result) {
        setIsError(true);
      } else {
        setIsVisibleMovieCard(true);

        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = result;

        const selectedMovie: Movie = {
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(selectedMovie);
      }
    })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false when the request is complete
      });
  };

  const handleAddMovieBtn = () => {
    if (!movies.find(movieItem => movieItem.imdbId === movie.imdbId)) {
      const newMovies = [...movies, movie];

      addMovie(newMovies);
    }

    setIsVisibleMovieCard(false);
    setInputValue('');
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
              className="input"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          {
            isError && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              onClick={handleSearchBtn}
              disabled={!inputValue}
            >
              Find a movie
            </button>
          </div>

          {isVisibleMovieCard && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieBtn}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {isVisibleMovieCard && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
