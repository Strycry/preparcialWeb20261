"use client";

import { useEffect, useState } from "react";
import { useAutores } from "../AutoresProvider";
import { useRouter } from "next/navigation";

export default function CrearUsuario() {
  const [nameF, modifyNameF] = useState("");
  const [descriptionF, modifyDescriptionF] = useState("");
  const [birthDateF, modifyBirthDateF] = useState("");
  const [imageF, modifyImageF] = useState("");
  const [errors, setErrors] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { agregarAutor, autores } = useAutores();
  const router = useRouter();

  const esValido =
    nameF.trim() !== "" &&
    descriptionF.trim() !== "" &&
    birthDateF !== "" &&
    imageF.trim() !== "";

  function validarFormulario() {
    const nuevosErrores = [];

    if (!nameF.trim()) {
      nuevosErrores.push("El nombre es requerido");
    }
    if (!descriptionF.trim()) {
      nuevosErrores.push("La descripción es requerida");
    }
    if (!birthDateF) {
      nuevosErrores.push("La fecha de nacimiento es requerida");
    }
    if (!imageF.trim()) {
      nuevosErrores.push("La URL de imagen es requerida");
    }

    return nuevosErrores;
  }

  useEffect(() => {
    if (!hasInteracted) {
      return;
    }

    setErrors(validarFormulario());
  }, [nameF, descriptionF, birthDateF, imageF, hasInteracted]);

  function handler(e) {
    e.preventDefault();
    setHasInteracted(true);

    const validacionErrores = validarFormulario();

    if (validacionErrores.length > 0) {
      setErrors(validacionErrores);
      return;
    }

    const nuevoAutor = {
      id: Math.max(...autores.map((a) => a.id), 0) + 1,
      name: nameF,
      description: descriptionF,
      birthDate: birthDateF,
      image: imageF,
    };

    agregarAutor(nuevoAutor);

    modifyNameF("");
    modifyDescriptionF("");
    modifyBirthDateF("");
    modifyImageF("");
    setErrors([]);
    setHasInteracted(false);

    router.push("/authors");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Autor</h1>

      {errors.length > 0 && (
        <div
          className="text-red-500 mb-4 p-3 border border-red-300 rounded bg-red-50"
          role="alert"
        >
          {errors.map((error, index) => (
            <p key={index}>- {error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handler}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-2">
            Nombre del autor:
          </label>
          <input
            id="name"
            type="text"
            value={nameF}
            onChange={(e) => {
              setHasInteracted(true);
              modifyNameF(e.target.value);
            }}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ingrese el nombre"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-2">
            Descripción:
          </label>
          <input
            id="description"
            type="text"
            value={descriptionF}
            onChange={(e) => {
              setHasInteracted(true);
              modifyDescriptionF(e.target.value);
            }}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ingrese la descripción"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="birthDate" className="block font-semibold mb-2">
            Fecha de nacimiento:
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDateF}
            onChange={(e) => {
              setHasInteracted(true);
              modifyBirthDateF(e.target.value);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block font-semibold mb-2">
            URL de imagen:
          </label>
          <input
            id="image"
            type="url"
            value={imageF}
            onChange={(e) => {
              setHasInteracted(true);
              modifyImageF(e.target.value);
            }}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={!esValido}
          className={`w-full text-white py-2 rounded font-bold ${
            esValido
              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Crear Autor
        </button>
      </form>
    </div>
  );
}
