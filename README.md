# Sitehive Admin Frontend

A modern React-based admin dashboard for managing tools, categories, and tags for the Sitehive platform.

## Features

- Manage tools: add, edit, delete, and filter tools
- Category and subcategory management with dynamic selection
- Tag management with multi-select
- Confirmation modals for destructive actions
- Responsive, accessible UI with Tailwind CSS
- State management via Zustand
- API integration for tools and categories

## Tech Stack

- **React** (functional components, hooks)
- **Zustand** for state management
- **React Router** for navigation
- **React Select** for multi-select UI
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Toastify** for notifications

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-org/sitehive-admin-frontendv2.git
cd sitehive-admin-frontendv2
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the root with:

```
VITE_API_URL_ADMIN_BACKEND=http://your-backend-url
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

## Usage

- **Tools Page:** View, search, filter, add, edit, and delete tools.
- **Add/Edit Tool:** 
  - Select categories and subcategories (only relevant subcategories are shown).
  - Add new categories and subcategories on the fly.
  - Assign multiple tags using the tag selector.
- **Confirmation Modals:** Appear before saving or deleting tools.

## Project Structure

- `src/pages/` — Main pages (AddTool, EditTool, etc.)
- `src/components/` — Shared UI components (modals, etc.)
- `src/store/` — Zustand stores for global state
- `src/utils/` — Custom hooks and utilities
- `src/assets/` — Static assets (if any)

## API Endpoints

- `/api/tools` — CRUD operations for tools
- `/api/categories` — Fetch categories and subcategories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (see commit message conventions below)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a pull request

### Commit Message Types

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

- **feat**: A new feature or enhancement  
  _Example:_ `feat(auth): add JWT authentication`
- **fix**: A bug fix  
  _Example:_ `fix(button): resolve issue with disabled state`
- **docs**: Documentation changes  
  _Example:_ `docs(readme): update installation instructions`
- **style**: Code style changes (formatting, etc.)  
  _Example:_ `style(header): fix inconsistent indentations`
- **refactor**: Code refactoring  
  _Example:_ `refactor(api): simplify data fetching logic`
- **perf**: Performance improvements  
  _Example:_ `perf(image): optimize image loading speed`
- **test**: Adding or modifying tests  
  _Example:_ `test(auth): add unit tests for login endpoint`
- **chore**: Maintenance or configuration  
  _Example:_ `chore(deps): update lodash version`
- **ci**: Continuous Integration changes  
  _Example:_ `ci: add linting step to CI pipeline`
- **build**: Build system or dependency changes  
  _Example:_ `build: upgrade Webpack configuration`
- **breaking change**: For breaking changes, add `BREAKING CHANGE:` in the commit footer.

## License

MIT
