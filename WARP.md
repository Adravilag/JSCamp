# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a JavaScript camp (DevJobs) repository from Midu.dev courses. It's designed as a learning environment for JavaScript development concepts and practices.

## Architecture & Development Environment

This repository is structured as a JavaScript learning environment that may evolve to include:

### Expected Project Structure
As the course progresses, the repository will likely develop into:
- **Exercises**: Individual JavaScript challenges and exercises
- **Projects**: Mini-projects demonstrating specific concepts
- **Utils**: Shared utility functions and helpers
- **Examples**: Code examples and demonstrations

### Technology Stack
The repository is focused on modern JavaScript development:
- **JavaScript (ES6+)**: Core language features and modern syntax
- **Node.js**: For server-side JavaScript and tooling
- **Web APIs**: Browser APIs and DOM manipulation
- **Testing**: Unit testing frameworks (Jest, Vitest, or similar)

## Common Development Commands

Since this is an early-stage repository, these commands will become relevant as the project develops:

### Package Management
```powershell
# Initialize npm (when package.json is created)
npm init -y

# Install dependencies
npm install

# Install dev dependencies
npm install --save-dev <package-name>
```

### Running Code
```powershell
# Run JavaScript files with Node.js
node <filename>.js

# Run with modern ES modules support
node --experimental-modules <filename>.mjs
```

### Testing (when test framework is added)
```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test <test-file>
```

### Development Tools
```powershell
# Format code (when prettier is configured)
npm run format

# Lint code (when eslint is configured)
npm run lint

# Start development server (for web projects)
npm run dev
# or
npm start
```

## Development Guidelines

### JavaScript Practices
- Use modern ES6+ features (arrow functions, destructuring, modules)
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Implement proper error handling with try-catch
- Follow functional programming concepts when applicable

### File Organization
- Group related functionality into modules
- Use clear, descriptive filenames
- Separate concerns (logic, presentation, configuration)
- Create index files for cleaner imports

### Learning Environment Considerations
- Each exercise should be self-contained
- Include comments explaining key concepts
- Provide examples of both basic and advanced usage
- Structure code to facilitate step-by-step learning

## Git Workflow

This repository follows a simple Git workflow suitable for learning:

```powershell
# Check current status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add <feature-description>"

# Push to origin
git push origin main
```

### Commit Message Convention
Follow conventional commits for clarity:
- `feat:` for new features or exercises
- `fix:` for bug fixes
- `docs:` for documentation updates
- `refactor:` for code improvements
- `test:` for test additions

## Future Development

As this repository evolves, expect to see:
- Package.json with project dependencies
- Testing frameworks and configurations
- Build tools and bundlers
- Example projects and exercises
- Documentation for specific JavaScript concepts

When these are added, update this WARP.md file with specific build, test, and development commands.