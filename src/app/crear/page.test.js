import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrearUsuario from './page';
import { AutoresProvider } from '../AutoresProvider';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

// Wrapper con el proveedor de autores
const renderWithProvider = (component) => {
  return render(<AutoresProvider>{component}</AutoresProvider>);
};

describe('CrearUsuario - Formulario', () => {
  // Test A: Renderizado Inicial
  describe('A. Renderizado Inicial', () => {
    test('debe encontrar los campos por label y el botón debe estar deshabilitado', () => {
      renderWithProvider(<CrearUsuario />);

      // Buscar campos por label
      const labelNombre = screen.getByLabelText(/nombre del autor/i);
      const labelDescripcion = screen.getByLabelText(/descripción/i);
      const labelFecha = screen.getByLabelText(/fecha de nacimiento/i);
      const labelImagen = screen.getByLabelText(/url de imagen/i);

      // Verificar que existen
      expect(labelNombre).toBeInTheDocument();
      expect(labelDescripcion).toBeInTheDocument();
      expect(labelFecha).toBeInTheDocument();
      expect(labelImagen).toBeInTheDocument();

      // Verificar que el botón está deshabilitado
      const boton = screen.getByRole('button', { name: /crear autor/i });
      expect(boton).toBeDisabled();
    });
  });

  // Test B: Uso Incorrecto - Validación y Errores
  describe('B. Uso Incorrecto - Validación', () => {
    test('debe mostrar errores y mantener botón deshabilitado cuando hay campos vacíos', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CrearUsuario />);

      const boton = screen.getByRole('button', { name: /crear autor/i });

      // Intentar hacer clic en el botón (aunque esté deshabilitado, simulamos el submit)
      // Llenamos solo un campo para simular uso incorrecto
      const inputNombre = screen.getByLabelText(/nombre del autor/i);
      await user.type(inputNombre, 'Juan');

      // Ahora el botón debe estar habilitado parcialmente
      // Pero si dejamos campos vacíos y enviamos, veremos errores
      // Primero, limpiamos el campo para volver a estado inválido
      await user.clear(inputNombre);

      // El botón debe estar deshabilitado
      expect(boton).toBeDisabled();

      // Intentamos hacer clic (aunque está deshabilitado)
      // En su lugar, hacemos un submit directo del formulario
      const form = screen.getByRole('button', { name: /crear autor/i }).closest('form');
      
      // Rellenamos solo parcialmente para provocar errores
      await user.type(inputNombre, 'Test');
      
      // Hacemos submit
      await user.click(boton);

      // Esperamos que aparezcan los mensajes de error
      await waitFor(() => {
        expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
        expect(screen.getByText(/la fecha de nacimiento es requerida/i)).toBeInTheDocument();
        expect(screen.getByText(/la url de imagen es requerida/i)).toBeInTheDocument();
      });

      // El botón debe seguir deshabilitado
      expect(boton).toBeDisabled();
    });
  });

  // Test C: Uso Correcto - Habilitación y Limpieza
  describe('C. Uso Correcto - Habilitación y Limpieza', () => {
    test('debe habilitar el botón y limpiar errores cuando todos los campos son válidos', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CrearUsuario />);

      const inputNombre = screen.getByLabelText(/nombre del autor/i);
      const inputDescripcion = screen.getByLabelText(/descripción/i);
      const inputFecha = screen.getByLabelText(/fecha de nacimiento/i);
      const inputImagen = screen.getByLabelText(/url de imagen/i);
      const boton = screen.getByRole('button', { name: /crear autor/i });

      // El botón debe estar deshabilitado al inicio
      expect(boton).toBeDisabled();

      // Llenar los campos
      await user.type(inputNombre, 'Gabriel García Márquez');
      expect(boton).toBeDisabled(); // Aún no todos llenos

      await user.type(inputDescripcion, 'Escritor colombiano');
      expect(boton).toBeDisabled();

      await user.type(inputFecha, '1927-03-06');
      expect(boton).toBeDisabled();

      await user.type(inputImagen, 'https://ejemplo.com/imagen.jpg');

      // Ahora sí, el botón debe estar habilitado
      await waitFor(() => {
        expect(boton).toBeEnabled();
      });

      // Verificar que no hay errores visibles
      expect(
        screen.queryByText(/es requerido/i)
      ).not.toBeInTheDocument();
    });
  });
});
