import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  describe('Rendering Tests', () => {
    test('renders without crashing', () => {
      render(<App />);
    });

    test('renders the main app container', () => {
      render(<App />);
      const appContainer = document.querySelector('.App');
      expect(appContainer).toBeInTheDocument();
    });

    test('renders the header section', () => {
      render(<App />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('App-header');
    });

    test('renders the React logo image', () => {
      render(<App />);
      const logo = screen.getByRole('img', { name: /logo/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('App-logo');
      expect(logo).toHaveAttribute('alt', 'logo');
    });

    test('renders the edit instruction text', () => {
      render(<App />);
      const editText = screen.getByText(/edit/i);
      expect(editText).toBeInTheDocument();
      expect(editText.textContent).toContain('Edit');
      expect(editText.textContent).toContain('src/App.js');
      expect(editText.textContent).toContain('save to reload');
    });

    test('renders learn react link', () => {
      render(<App />);
      const linkElement = screen.getByText(/learn react/i);
      expect(linkElement).toBeInTheDocument();
    });

    test('renders code element with proper styling', () => {
      render(<App />);
      const codeElement = screen.getByText('src/App.js');
      expect(codeElement.tagName).toBe('CODE');
    });
  });

  describe('Accessibility Tests', () => {
    test('has proper semantic structure', () => {
      render(<App />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    test('logo has appropriate alt text', () => {
      render(<App />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('alt', 'logo');
    });

    test('external link has security attributes', () => {
      render(<App />);
      const link = screen.getByRole('link', { name: /learn react/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('external link has correct href', () => {
      render(<App />);
      const link = screen.getByRole('link', { name: /learn react/i });
      expect(link).toHaveAttribute('href', 'https://reactjs.org');
    });
  });

  describe('Visual Structure Tests', () => {
    test('applies correct CSS classes to main container', () => {
      render(<App />);
      const appContainer = document.querySelector('.App');
      expect(appContainer).toBeInTheDocument();
    });

    test('applies correct CSS classes to header', () => {
      render(<App />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('App-header');
    });

    test('applies correct CSS classes to logo', () => {
      render(<App />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveClass('App-logo');
    });

    test('applies correct CSS classes to link', () => {
      render(<App />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('App-link');
    });

    test('maintains proper component hierarchy', () => {
      render(<App />);
      const appContainer = document.querySelector('.App');
      const header = screen.getByRole('banner');
      const logo = screen.getByRole('img');
      const link = screen.getByRole('link');

      expect(appContainer).toContainElement(header);
      expect(header).toContainElement(logo);
      expect(header).toContainElement(link);
    });
  });

  describe('Integration Tests', () => {
    test('logo image source is properly set', () => {
      render(<App />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('src');
      expect(logo.getAttribute('src')).toBeTruthy();
    });

    test('external link configuration is secure', () => {
      render(<App />);
      const link = screen.getByRole('link', { name: /learn react/i });

      expect(link.getAttribute('href')).toBe('https://reactjs.org');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    test('all text content is present and correct', () => {
      render(<App />);

      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText('src/App.js')).toBeInTheDocument();
      expect(screen.getByText(/save to reload/i)).toBeInTheDocument();
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
    });
  });
});
