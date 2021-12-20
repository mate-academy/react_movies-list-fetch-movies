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

  addMovies = (movie:Movie) => {
    if (this.state.movies.every(el => el.imdbID !== movie.imdbID)) {
      this.setState(state => ({
        movies: [...state.movies, movie],
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
          <FindMovie callback={this.addMovies} />
        </div>
      </div>
    );
  }
}
