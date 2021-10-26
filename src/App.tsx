import { Component } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  handleAddMovie = (movie: Movie) => {
    this.setState(({ movies }) => {
      const hasMovie = movies.some(({ imdbID }) => imdbID === movie.imdbID);

      return {
        movies: hasMovie ? movies : [...movies, movie],
      };
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.handleAddMovie} />
        </div>
      </div>
    );
  }
}
