import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { useEffect } from 'react';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleSearch = () => {
    setSearchQuery(query.trim());
  };

  function mapMovieDataToMovie(data: MovieData): Movie {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster && data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  useEffect(() => {
    if (!searchQuery) {
      setIsError(false);

      return;
    }

    setLoading(true);

    getMovie(searchQuery)
      .then(result => {
        if (result.Response === 'True') {
          const mappedMovie = mapMovieDataToMovie(result);

          setSelectedMovie(mappedMovie);
          setIsError(false);
        } else {
          setIsError(true);
          setSelectedMovie(null);
        }
      })
      .finally(() => setLoading(false));
  }, [searchQuery]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          handleQuery={handleQuery}
          handleSearch={handleSearch}
          isError={isError}
          loading={loading}
          movie={selectedMovie}
          onAdd={() => {
            if (selectedMovie) {
              const isAlreadyAdded = movies.some(
                movie => movie.imdbId === selectedMovie.imdbId,
              );

              if (!isAlreadyAdded) {
                setMovies(prev => [...prev, selectedMovie]);
              }

              setQuery('');
              setSearchQuery('');
              setSelectedMovie(null);
            }
          }}
        />
      </div>
    </div>
  );
};
