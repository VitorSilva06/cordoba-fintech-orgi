# Córdoba Fintech - Frontend

Sistema de gestão de cobrança para instituições financeiras.

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── base/        # Componentes de gestão de base
│   │   ├── communication/ # Componentes de comunicação
│   │   ├── dashboards/  # Dashboards por perfil
│   │   ├── examples/    # Componentes de exemplo
│   │   ├── figma/       # Componentes do Figma
│   │   ├── landing/     # Landing page da plataforma
│   │   ├── landingpage/ # Landing page principal
│   │   ├── payments/    # Componentes de pagamento
│   │   ├── segmentation/ # Componentes de segmentação
│   │   └── ui/          # Componentes de UI (shadcn/ui)
│   ├── layouts/         # Layouts principais
│   ├── pages/           # Páginas da aplicação
│   ├── config/          # Arquivos de configuração
│   ├── styles/          # Estilos globais
│   ├── hooks/           # Custom hooks
│   ├── services/        # Serviços e API calls
│   ├── assets/          # Imagens e recursos estáticos
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
├── public/              # Arquivos públicos
└── package.json

```

## Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Linguagem de programação
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes UI primitivos
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## Rotas

- `/` - Landing page
- `/app/*` - Aplicação principal (dashboards, gestão, etc.)

## Características

- ✅ Sem sistema de autenticação
- ✅ Arquitetura modular e escalável
- ✅ Componentes reutilizáveis
- ✅ Tailwind CSS para estilização
- ✅ TypeScript para type safety
- ✅ Design responsivo
- ✅ Landing page desacoplada

## Desenvolvimento

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse http://localhost:3000

## Build

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Estrutura de Componentes

### UI Components (shadcn/ui)
Componentes de interface reutilizáveis baseados em Radix UI.

### Dashboards
Dashboards específicos por perfil de usuário (Diretor, Gerente, Operador, Cliente).

### Business Components
Componentes de negócio organizados por domínio (base, communication, payments, segmentation).

### Landing Page
Landing page institucional completamente desacoplada da aplicação principal.

## Boas Práticas

- Componentes funcionais com hooks
- TypeScript strict mode
- Separação clara de responsabilidades
- Nomenclatura consistente
- Código modular e reutilizável
- Estilos com Tailwind CSS
- Importações organizadas

## Próximos Passos

- [ ] Integração com backend
- [ ] Gerenciamento de estado global (se necessário)
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] Otimizações de performance
- [ ] Documentação de componentes
