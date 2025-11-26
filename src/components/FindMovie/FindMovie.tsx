import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieList, setMovieList] = useState<Movie[]>([]);

  function isMovieData(data: MovieData | ResponseError): data is MovieData {
    return (data as MovieData).Title !== undefined;
  }

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await getMovie(query);

      if (!isMovieData(data)) {
        setError("Can't find a movie with such a title");
        setLoading(false);
        setMovie(null);

        return;
      }

      setError('');
      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });
    } catch {
      setError('Unexpected error');
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      const alreadyAdded = movieList.some(m => m.imdbId === movie.imdbId);

      if (!alreadyAdded) {
        setMovieList(prev => [...prev, movie]);
      }

      setMovie(null);
      setQuery('');
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
              className="input"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setError('');
              }}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!query || loading}
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
                onClick={handleAddMovie}
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

      {movieList && (
        <div className="container" data-cy="movieList">
          <h2 className="title">My Movies</h2>
          {movieList.map(m => (
            <MovieCard key={m.imdbId} movie={m} />
          ))}
        </div>
      )}
    </>
  );
};
