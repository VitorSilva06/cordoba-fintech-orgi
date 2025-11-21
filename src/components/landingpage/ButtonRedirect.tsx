import React from 'react';

function ButtonRedirect() {
  return (
    <a
      className="
        px-6 sm:px-10 
        py-3 sm:py-4 
        bg-accent-yellow 
        text-black 
        text-lg sm:text-xl 
        font-bold 
        rounded-full 
        shadow-lg 
        hover:shadow-accent-yellow/50 
        transition 
        duration-300 
        transform 
        hover:scale-105 
        inline-block 
        text-center
      "
      href="https://pace-bacon-15036285.figma.site/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Solicite uma demonstração
    </a>
  );
}

export default ButtonRedirect;
