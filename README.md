# Movies list - Fetch movies
- Replace `<your_account>` with your Github username in the
 [DEMO LINK](https://misharosa.github.io/react_movies-list-fetch-movies/)
- Follow the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline)
- Use [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript)

## Task
Implement `FindMovie` component to load movies from [OMDb API](http://www.omdbapi.com/) (You need to register and get an API key).

> Don't use class components. Use React Hooks instead.

1. When user enters a movie title and clicks a search button, send a request to `https://www.omdbapi.com/?apikey=[yourkey]&t=[title]`.
1. If film is not found show an error message below the input. Hide the error after changing a title.
1. If a film has been found show the preview as a `MovieCard`.
1. Add a movie to the list after submitting a form and clear the input.
1. Don't add the same film to the list twice (compare by `imdbId`).


# Список фільмів - отримати фільми
- Дотримуйтесь [Рекомендації щодо виконання завдань React](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline)
- Використовуйте [шпаргалку React TypeScript](https://mate-academy.github.io/fe-program/js/extra/react-typescript)

## Завдання
Реалізуйте компонент `FindMovie` для завантаження фільмів із [OMDb API](http://www.omdbapi.com/) (Вам потрібно зареєструватися та отримати ключ API).

> Не використовуйте компоненти класу. Натомість використовуйте React Hooks.

1. Коли користувач введе назву фільму та натисне кнопку пошуку, надішліть запит на адресу `https://www.omdbapi.com/?apikey=[yourkey]&t=[title]`.
1. Якщо плівку не знайдено, відобразіть повідомлення про помилку під вводом. Приховати помилку після зміни назви.
1. Якщо фільм було знайдено, покажіть попередній перегляд як «Картку фільму».
1. Додайте фільм до списку після заповнення форми та очистіть введені дані.
1. Не додавайте один і той самий фільм до списку двічі (порівняйте за `imdbId`).
