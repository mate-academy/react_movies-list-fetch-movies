# Movies list - Fetch movies

Implement the `FindMovie` component to load movies from [OMDb API](http://www.omdbapi.com/) (You need to register and get an API key).

1. When a user enters a title and submits the form, send a request to `https://www.omdbapi.com/?apikey=[yourkey]&t=[title]`;
    - use the `getMovie` method from the `api.ts`;
1. The submit button should be disabled when the title field is empty;
1. Show a spinner on the submit button while waiting for the respose;
    - use `is-loading` class;
    - loading should be finished in any case (use `finally`);
1. If a movie is not found show an error message below the input;
    - hide it after changing the title;
1. If a movie is found show the preview as a `MovieCard` and the add button;
    - the API return `MovieData` or `ReposnseError` (see the `types`)
    - don't forget to normalize received `MovieData`
    - use [the deafult picture](https://via.placeholder.com/360x270.png?text=no%20preview) if the found movie has no poster.
1. The add button should **add** the movie to the list, **clear** the form and **remove** the preview;
1. Don't add a movie to the list twice (compare by `imdbId`), just clear the data;

## Github flow
1. **Fork** the repo.
2. **Clone** the forked one. (The project link should have your name but not `mate-academy`)
3. Run `npm install` (or just `npm i`).
4. Run `npm start`.
5. Open one more terminal window for the next steps.
6. `git checkout -b develop` - to create new branch and switch on it.
7. Write you code in `src` folder.
8. Run `npm run lint` and fix code style errors.
9. Run `npm run deploy` to deploy your solution to `gh-pages`.
10. `git add . && git commit -m 'solution'` to save your changes.
11. `git push origin develop` - to send you code for PR.
12. Create a Pull Request (PR) from your branch `develop` to branch `master` of original repo.
13. Replace `<your_account>` with your Github username in the
  [DEMO LINK](https://kamal-tufekcic.github.io/layout_dia/).
14. Copy `DEMO LINK` to the PR description.

> To update you PR repeat steps 7-11.
