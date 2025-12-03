import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";

export function Register() {
  return (
    <div
      className="h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-primary-dark via-[#39279a] to-primary-dark"
    >
      <div
        className="w-full max-w-md bg-[#39279a]/70 backdrop-blur-xl
        border border-neon-blue/20 shadow-[0_0_35px_rgba(0,0,0,0.4)]
        rounded-3xl p-8"
      >
        {/* HEADER */}
        <header className="text-center space-y-2 mb-4">
          <h1 className="text-accent-yellow text-3xl font-semibold tracking-wide">
            CÓRDOBA FINTECH
          </h1>

          <p className="text-accent-yellow text-xs">
            INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
          </p>

          <div
            className="mx-auto mt-4 w-20 h-20 bg-accent-yellow rounded-2xl
            flex items-center justify-center shadow-lg"
          >
            <UserIcon className="w-10 h-10 text-dark-text" />
          </div>

          <h3 className="text-neon-blue text-xl mt-3">Criar Conta</h3>

          <p className="text-neon-blue/80 text-sm">
            Preencha os dados abaixo para se cadastrar
          </p>
        </header>

        {/* FORM */}
        <section>
          <form className="space-y-5">

            {/* Nome */}
            <div className="space-y-1">
              <label htmlFor="nome" className="text-neon-blue text-sm font-medium">
                Nome completo
              </label>

              <div className="relative flex items-center">
                <UserIcon className="absolute left-3 w-5 h-5 text-neon-blue/60" />

                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-primary-dark 
                  border border-neon-blue/30 rounded-xl text-neon-blue
                  placeholder:text-neon-blue/40 focus:border-neon-blue
                  focus:ring-2 focus:ring-neon-blue/40 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-neon-blue text-sm font-medium">
                E-mail
              </label>

              <div className="relative flex items-center">
                <EnvelopeIcon className="absolute left-3 w-5 h-5 text-neon-blue/60" />

                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-primary-dark 
                  border border-neon-blue/30 rounded-xl text-neon-blue
                  placeholder:text-neon-blue/40 focus:border-neon-blue
                  focus:ring-2 focus:ring-neon-blue/40 outline-none"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label htmlFor="senha" className="text-neon-blue text-sm font-medium">
                Senha
              </label>

              <div className="relative flex items-center">
                <LockClosedIcon className="absolute left-3 w-5 h-5 text-neon-blue/60" />

                <input
                  id="senha"
                  type="password"
                  placeholder="********"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-primary-dark
                  border border-neon-blue/30 rounded-xl text-neon-blue
                  placeholder:text-neon-blue/40 focus:border-neon-blue
                  focus:ring-2 focus:ring-neon-blue/40 outline-none"
                />
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1">
              <label htmlFor="confirmar_senha" className="text-neon-blue text-sm font-medium">
                Confirmar senha
              </label>

              <div className="relative flex items-center">
                <LockClosedIcon className="absolute left-3 w-5 h-5 text-neon-blue/60" />

                <input
                  id="confirmar_senha"
                  type="password"
                  placeholder="********"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-primary-dark
                  border border-neon-blue/30 rounded-xl text-neon-blue
                  placeholder:text-neon-blue/40 focus:border-neon-blue
                  focus:ring-2 focus:ring-neon-blue/40 outline-none"
                />
              </div>
            </div>

            {/* VOLTAR */}
            <a
              href="/login"
              className="text-accent-yellow text-sm hover:opacity-80 transition block"
            >
              Já possui conta? Fazer login
            </a>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full h-12 bg-accent-yellow text-dark-text
              font-semibold rounded-xl hover:bg-[#FFD54F] transition"
            >
              Criar Conta
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
