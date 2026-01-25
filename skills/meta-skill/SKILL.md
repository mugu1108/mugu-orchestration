---
name: meta-skill
description: Generate new skills interactively. Use this skill when creating new automation workflows, agents, or commands for the mugu-orchestration system.
triggers:
  - "create new skill"
  - "generate skill"
  - "add automation"
  - "make new skill"
---

# Meta Skill: Skill Generator

This skill guides you through creating new skills for the mugu-orchestration system.

## When to Activate

- Creating new automation workflows
- Adding new business logic
- Defining new agent capabilities
- Building reusable command patterns

## Skill Creation Process

### Step 1: Gather Requirements

Ask the user:
1. **Skill Name**: What should this skill be called? (kebab-case, e.g., 'invoice-generator')
2. **Description**: One-line description of what this skill does
3. **Category**: Type of skill (automation, documentation, analysis, integration, workflow)
4. **Triggers**: Keywords or phrases that should activate this skill
5. **Tools Required**: Which tools will this skill use? (Read, Write, Bash, Grep, etc.)
6. **MCP Integration**: Does this skill need MCP servers? (Supabase, GitHub, etc.)

### Step 2: Choose Template Type

Based on the category, select the appropriate template:

#### A. Basic Automation Skill
For simple task automation without external integrations.

#### B. Agent-Integrated Skill
For skills that delegate to specialized agents.

#### C. MCP-Integrated Skill
For skills that interact with external services via MCP.

#### D. Workflow Orchestration Skill
For complex multi-step workflows.

### Step 3: Generate SKILL.md

Create the skill file with:

```markdown
---
name: {skill-name}
description: {description}
category: {category}
triggers:
  - "{trigger1}"
  - "{trigger2}"
tools: [{tools}]
mcp_servers: [{mcp_servers}]
---

# {Skill Title}

{Description paragraph}

## When to Activate

- {Use case 1}
- {Use case 2}
- {Use case 3}

## Prerequisites

- {Prerequisite 1}
- {Prerequisite 2}

## Workflow Steps

### Step 1: {Step Name}

{Step description and implementation details}

### Step 2: {Step Name}

{Step description and implementation details}

## Example Usage

```
User: {example user request}

Agent: {example response}
```

## Configuration

{Any configuration needed}

## Best Practices

1. {Best practice 1}
2. {Best practice 2}
```

### Step 4: Register in Supabase

Insert skill metadata into the `skills` table:

```typescript
await supabase.from('skills').insert({
  name: skillName,
  description: description,
  category: category,
  triggers: triggers,
  template_path: `skills/${skillName}/SKILL.md`,
  metadata: { /* additional metadata */ }
})
```

### Step 5: Create Supporting Files

If needed, create:
- **Templates** in `skills/{skill-name}/templates/`
- **Scripts** in `scripts/{skill-name}/`

### Step 6: Update Documentation

Add the new skill to README.md - Skills section

## Skill Templates

### Template A: Basic Automation Skill

```markdown
---
name: {skill-name}
description: {description}
category: automation
---

# {Skill Title}

## Workflow Steps

### Step 1: Validate Input
### Step 2: Execute Action
### Step 3: Log Result
### Step 4: Notify User
```

### Template B: MCP-Integrated Skill

```markdown
---
name: {skill-name}
description: {description}
category: integration
mcp_servers:
  - supabase
---

# {Skill Title}

## MCP Integration

This skill uses the following MCP servers:
- **Supabase**: Data persistence and retrieval

### Supabase Operations

1. Query existing records
2. Insert new data
3. Update status
4. Return results
```

## Best Practices for Skill Creation

1. **Clear Naming**: Use kebab-case, descriptive names
2. **Single Responsibility**: Each skill should do one thing well
3. **Composability**: Skills should be composable with other skills
4. **Error Handling**: Always include error scenarios
5. **Documentation**: Comprehensive examples and use cases
6. **Logging**: Log execution to Supabase for analytics

## Success Metrics

After creating a skill, verify:
- [ ] SKILL.md file exists with valid frontmatter
- [ ] Description is clear and concise
- [ ] Triggers are specific and unambiguous
- [ ] Workflow steps are detailed
- [ ] Example usage is provided
- [ ] Skill registered in Supabase `skills` table
- [ ] Documentation updated

---

**Remember**: Good skills are self-documenting, composable, and handle errors gracefully.
