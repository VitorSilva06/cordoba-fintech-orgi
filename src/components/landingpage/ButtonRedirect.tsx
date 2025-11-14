import React from 'react';

function ButtonRedirect() {
  return (
    <a className="px-10 py-4 bg-accent-yellow text-primary-dark text-xl font-bold rounded-full shadow-lg hover:shadow-accent-yellow/50 transition duration-300 transform hover:scale-105"
      href="https://pace-bacon-15036285.figma.site/"  // ⬅️ A URL para onde o usuário será enviado
      target="_blank"                 // ⬅️ Opcional: Abre o link em uma nova aba
      rel="noopener noreferrer"       // ⬅️ Opcional: Recomendado por segurança ao usar target="_blank"
    >
      ACESSAR SISTEMA
    </a>
  );
}

export default ButtonRedirect;