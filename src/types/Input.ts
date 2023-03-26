import { OnChange } from './events';

export type InputType = 'text' | 'checkbox' | 'radio';

export interface InputProps {
  id: string,
  label: string,
  value: string;
  dataCy: string,
  type?: InputType;
  hasError?: boolean,
  placeholder?: string,
  onChange: OnChange;
}
