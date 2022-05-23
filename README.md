# Movies list - Fetch movies
- Replace `<your_account>` with your Github username in the
 [DEMO LINK](https://lem47.github.io/react_movies-list-fetch-movies/)
- Follow the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline)
- Use [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript)

## Task
Implement `FindMovie` component to load movies from [OMDb API](https://www.omdbapi.com/) (You need to register and get an API key).

> Don't use class components. Use React Hooks instead.

1. When user enters a movie title and clicks a search button, send a request to `https://www.omdbapi.com/?apikey=[yourkey]&t=[title]`.
2. If film is not found show an error message below the input. Hide the error after changing a title.
3. If a film has been found show the preview as a `MovieCard`.
4. Add a movie to the list after submitting a form and clear the input.
5. Don't add the same film to the list twice (compare by `imdbId`).
