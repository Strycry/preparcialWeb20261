"use client";

import { useAutores } from "../AutoresProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AutoresPage() {
  const { autores, eliminarAutor } = useAutores();
  const router = useRouter();
  const [filtro, setFiltro] = useState("");

  function manejarEliminar(idAutor) {
    if (confirm("¿Estás seguro de que deseas eliminar este autor?")) {
      eliminarAutor(idAutor);
    }
  }

  // Filtrar autores sin estado adicional (case-insensitive)
  const autoresFiltrados = autores.filter((autor) =>
    autor.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Autores</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {autoresFiltrados.length === 0 && filtro.length > 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No se encontraron autores que coincidan con "{filtro}"
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {autores.length === 0 ? (
            <p>Cargando autores...</p>
          ) : (
            autoresFiltrados.map((autor) => (
              <li
                key={autor["id"]}
                className="p-4 border rounded-lg shadow-md flex flex-col items-center bg-white"
              >
                <div className="w-full">
                  <img
                    src={autor["image"]}
                    alt={autor["name"]}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h2 className="font-bold text-lg text-center mb-2">
                    {autor["name"]}
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-2">
                    {autor["description"]}
                  </p>
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Nacido: {autor["birthDate"]}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/editar/${autor["id"]}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => manejarEliminar(autor["id"])}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}
