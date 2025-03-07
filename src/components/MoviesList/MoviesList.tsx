import React from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import './MoviesList.scss';

interface MoviesListProps {
  movies: Movie[];
}

export const MoviesList: React.FC<MoviesListProps> = ({ movies }) => (
  <div className="movies-list">
    <h2 className="title">Movies list:</h2>
    {movies.length === 0 ? (
      <p>No movies in the list yet.</p>
    ) : (
      movies.map(movie => <MovieCard key={movie.imdbId} movie={movie} />)
    )}
  </div>
);
