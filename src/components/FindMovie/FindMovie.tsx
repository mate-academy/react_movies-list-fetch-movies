import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTitle(e.target.value);
    setError('');
  }

  function normalizeMovieData(movieData: MovieData): Movie {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl:
        movieData.Poster !== 'N/A'
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  }

  const handleAddMovie = () => {
    if (!foundMovie) {
      return;
    }

    const isDuplicate = movies.some(
      movie => movie.imdbId === foundMovie.imdbId,
    );

    if (!isDuplicate) {
      onAddMovie(foundMovie); // Додати тільки якщо не дублікат
    }

    // Завжди очистити форму (і для дублікатів теж)
    setSearchTitle('');
    setFoundMovie(null);
    setError('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Зупинити перезавантаження сторінки

    setIsLoading(true); // Показати спінер
    setError(''); // Очистити стару помилку
    setFoundMovie(null); // Очистити старий результат

    try {
      const result = await getMovie(searchTitle);

      if ('Response' in result && result.Response === 'False') {
        setError(result.Error);
      } else {
        const normalizedMovie = normalizeMovieData(result as MovieData);

        setFoundMovie(normalizedMovie);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false); // Завжди вимкнути спінер
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={searchTitle}
              onChange={handleInputChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!searchTitle.trim()}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
