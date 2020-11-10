# Movies list - Fetch movies
- Replace `<your_account>` with your Github username in the
 [DEMO LINK](https://KirillLutsenko.github.io/react_movies-list-fetch-movies/)
- Follow the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline)

## Task
Implement `FindMovie` component to load movies from [OMDb API](http://www.omdbapi.com/) (You need to register and get an API key).

> Don't use class components. Use React Hooks instead.

1. When user enters a movie title and clicks a search button, send a request to `http://www.omdbapi.com/?apikey=[yourkey]&t=[title]`.
1. If film is not found show an error message below the input. Hide the error after changing a title.
1. If a film has been found show the preview as a `MovieCard`.
1. Add a movie to the list after submitting a form and clear the input.
1. Don't add the same film to the list twice (compare by `imdbId`).
