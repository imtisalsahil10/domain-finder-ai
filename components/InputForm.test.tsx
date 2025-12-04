import { render, screen } from '@testing-library/react';
import InputForm from '../InputForm';

describe('InputForm', () => {
  test('renders InputForm component', () => {
    render(<InputForm />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  test('submits the form', () => {
    render(<InputForm />);
    const inputElement = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    inputElement.value = 'Test input';
    submitButton.click();

    expect(inputElement.value).toBe('');
  });
});