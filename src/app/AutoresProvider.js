"use client";

import { createContext, useState, useContext, useEffect } from "react";

const AutoresContext = createContext();

export function AutoresProvider({ children }) {
  const [autores, setAutores] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/authors")
      .then((res) => res.json())
      .then((data) => {
        setAutores(data);
      })
      .catch((error) => console.error("Error al buscar autores:", error));
  }, []);

  function agregarAutor(nuevoAutor) {
    setAutores([...autores, nuevoAutor]);
  }

  function editarAutor(idAutor, datosActualizados) {
    const autoresActualizados = autores.map((autor) => {
      if (autor.id === idAutor) {
        return { ...autor, ...datosActualizados };
      }
      return autor;
    });
    setAutores(autoresActualizados);
  }

  function eliminarAutor(idAutor) {
    const autoresFiltrados = autores.filter((autor) => autor.id !== idAutor);
    setAutores(autoresFiltrados);
  }

  return (
    <AutoresContext.Provider value={{ autores, agregarAutor, editarAutor, eliminarAutor }}>
      {children}
    </AutoresContext.Provider>
  );
}

export function useAutores() {
  const context = useContext(AutoresContext);
  if (!context) {
    throw new Error("useAutores debe usarse dentro de AutoresProvider");
  }
  return context;
}
