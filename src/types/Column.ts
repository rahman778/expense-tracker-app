export type Column<T> = {
  header: string;
  key: keyof T | "actions";
  render?: (row: T) => React.JSX.Element | string | undefined;
};
