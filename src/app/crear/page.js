"use client";

import { useState } from "react";
import { useAutores } from "../AutoresProvider";
import { useRouter } from "next/navigation";

export default function CrearUsuario() {
  const [nameF, modifyNameF] = useState("");
  const [descriptionF, modifyDescriptionF] = useState("");
  const [birthDateF, modifyBirthDateF] = useState("");
  const [imageF, modifyImageF] = useState("");
  const [error, setError] = useState("");

  const { agregarAutor, autores } = useAutores();
  const router = useRouter();

  function handler(e) {
    e.preventDefault();

    // Validar campos
    if (!nameF || !descriptionF || !birthDateF || !imageF) {
      setError("Todos los campos son requeridos");
      return;
    }

    // Crear nuevo autor con ID único
    const nuevoAutor = {
      id: Math.max(...autores.map((a) => a.id), 0) + 1,
      name: nameF,
      description: descriptionF,
      birthDate: birthDateF,
      image: imageF,
    };

    agregarAutor(nuevoAutor);

    // Limpiar campos
    modifyNameF("");
    modifyDescriptionF("");
    modifyBirthDateF("");
    modifyImageF("");
    setError("");

    // Navegar a la lista de autores
    router.push("/authors");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Autor</h1>

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
          className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
        >
          Crear Autor
        </button>
      </form>
    </div>
  );
}
