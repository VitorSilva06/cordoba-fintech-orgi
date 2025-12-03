import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export function Forms() {
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
        {/* Header */}
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
            <LockClosedIcon className="w-10 h-10 text-dark-text" />
          </div>

          <h3 className="text-neon-blue text-xl mt-3">Bem-vindo</h3>

          <p className="text-neon-blue/80 text-sm">
            Entre com suas credenciais para acessar o sistema
          </p>
        </header>

        {/* Form */}
        <section>
          <form className="space-y-5">
            {/* E-mail */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-neon-blue text-sm font-medium"
              >
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
              <label
                htmlFor="senha"
                className="text-neon-blue text-sm font-medium"
              >
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

            {/* Links */}
            <div className="space-y-1 text-sm">
              <a
                href=""
                className="text-accent-yellow hover:opacity-80 transition block"
              >
                Esqueceu a senha?
              </a>

              <a
                href="/register"
                className="text-accent-yellow hover:opacity-80 transition block"
              >
                Criar conta
              </a>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full h-12 bg-accent-yellow text-dark-text
              font-semibold rounded-xl hover:bg-[#FFD54F] transition"
            >
              Entrar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
