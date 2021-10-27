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

  addMovie = (movieToAdd: Movie) => {
    const isValid = this.state.movies.some(movie => movieToAdd.imdbID === movie.imdbID);

    if (!isValid) {
      this.setState(state => ({
        movies: [...state.movies, movieToAdd],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
