"use client";

import { useState, useEffect } from "react";
import { useAutores } from "../../AutoresProvider";
import { useRouter, useParams } from "next/navigation";

export default function EditarAutor() {
  const [nameF, modifyNameF] = useState("");
  const [descriptionF, modifyDescriptionF] = useState("");
  const [birthDateF, modifyBirthDateF] = useState("");
  const [imageF, modifyImageF] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const { autores, editarAutor } = useAutores();
  const router = useRouter();
  const params = useParams();

  const idAutor = parseInt(params.id);

  useEffect(() => {
    const autor = autores.find((a) => a.id === idAutor);
    if (autor) {
      modifyNameF(autor.name);
      modifyDescriptionF(autor.description);
      modifyBirthDateF(autor.birthDate);
      modifyImageF(autor.image);
      setCargando(false);
    } else {
      setError("Autor no encontrado");
      setCargando(false);
    }
  }, [autores, idAutor]);

  function handler(e) {
    e.preventDefault();

    // Validar campos
    if (!nameF || !descriptionF || !birthDateF || !imageF) {
      setError("Todos los campos son requeridos");
      return;
    }

    const datosActualizados = {
      name: nameF,
      description: descriptionF,
      birthDate: birthDateF,
      image: imageF,
    };

    editarAutor(idAutor, datosActualizados);

    // Navegar a la lista de autores
    router.push("/authors");
  }

  if (cargando) {
    return <div className="p-8">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Autor</h1>

      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

      <form onSubmit={handler}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nombre del autor:</label>
          <input
            type="text"
            value={nameF}
            onChange={(e) => modifyNameF(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ingrese el nombre"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Descripción:</label>
          <input
            type="text"
            value={descriptionF}
            onChange={(e) => modifyDescriptionF(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ingrese la descripción"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Fecha de nacimiento:
          </label>
          <input
            type="date"
            value={birthDateF}
            onChange={(e) => modifyBirthDateF(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">URL de imagen:</label>
          <input
            type="url"
            value={imageF}
            onChange={(e) => modifyImageF(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
