# mugu-orchestration

Personal orchestration system for work automation with Claude Code integration.

## Overview

mugu-orchestration is a powerful orchestration framework that extends Claude Agent SDK with custom skills, agents, and workflows. It provides a structured approach to automating common work tasks including:

- Creating and managing custom skills
- Integrating with Supabase for data persistence
- Building workflow automation
- Managing agent execution and logging

## Features

- **Skill Management**: Create, register, and manage custom skills
- **Supabase Integration**: Complete database backend for skill execution tracking
- **Meta-Skill System**: Generate new skills using the meta-skill
- **MCP Integration**: Seamless integration with Model Context Protocol servers
- **Claude Code Plugin**: Works as a native Claude Code plugin

## Project Structure

```
mugu-orchestration/
├── src/
│   ├── cli/                 # CLI commands
│   ├── lib/
│   │   ├── supabase/       # Supabase client and schema
│   │   └── skill-manager.ts # Skill management
│   └── types/              # TypeScript type definitions
├── skills/
│   └── meta-skill/         # Skill generator skill
├── .claude-plugin/         # Plugin configuration
├── mcp-configs/            # MCP server configurations
└── package.json
```

## Installation

### 1. Clone or Initialize

```bash
cd ~/mugu-orchestration
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Set Up Supabase

Initialize Supabase locally:

```bash
npx supabase init
npx supabase start
```

This will start a local Supabase instance with PostgreSQL.

### 4. Apply Database Schema

Copy the SQL schema from [src/lib/supabase/schema.sql](src/lib/supabase/schema.sql) and run it in your Supabase SQL Editor or via:

```bash
npx supabase db reset
```

Then paste the schema content into the SQL editor and execute.

### 5. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials (obtained from `npx supabase status`):

```bash
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Verify Installation

```bash
npm run cli -- --version
```

## Usage

### CLI Commands

```bash
# Initialize Supabase (shows setup instructions)
npm run cli init

# List all skills
npm run cli list
```

### Using as Claude Code Plugin

1. Copy plugin configuration:
   - Plugin is configured in `.claude-plugin/plugin.json`
   - Skills are located in `skills/`

2. Skills will be automatically discovered by Claude Code

### Creating New Skills

Use the meta-skill to create new skills:

1. Describe your automation need to Claude
2. The meta-skill will guide you through skill creation
3. Skills are automatically registered in Supabase

See [skills/meta-skill/SKILL.md](skills/meta-skill/SKILL.md) for details.

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

## Database Schema

The system uses Supabase with the following tables:

- **skills**: Skill definitions and metadata
- **skill_executions**: Execution history and logs
- **agent_executions**: Agent invocation logs
- **configurations**: System configuration storage

See [src/lib/supabase/schema.sql](src/lib/supabase/schema.sql) for complete schema.

## MCP Integration

The system integrates with MCP servers configured in [mcp-configs/mcp-servers.json](mcp-configs/mcp-servers.json):

- **supabase**: Database operations
- **github**: Repository operations
- **filesystem**: File system access

## Future Enhancements

- Seminar slide generation (Marp integration)
- Time tracking with Slack/Discord notifications
- Invoice generation
- Additional automation workflows

## License

MIT

## Author

Seiji

---

Built with [Claude Code](https://claude.com/claude-code)
