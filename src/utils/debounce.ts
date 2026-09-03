export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}
