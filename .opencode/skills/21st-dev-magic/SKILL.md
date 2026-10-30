---
name: 21st-dev-magic
description: "Guidance for using the 21st.dev Magic AI Agent and MCP to generate, integrate, and customize modern UI components through natural-language requests. Apply when the user asks about 21st.dev Magic, /ui generation, Magic MCP setup, supported IDE integrations, component generation, or 21st.dev-inspired frontend work."
---

# 21st.dev Magic AI Agent

Use this skill when the user asks to configure or use 21st.dev Magic, generate UI through `/ui`, connect the Magic MCP server, or integrate generated components into a project.

## Core workflow

1. Identify the requested component, page, interaction, target stack, and existing project conventions.
2. Prefer the project’s existing component library, styling system, and file structure.
3. For UI generation, formulate a precise natural-language request. Example:
   ```text
   /ui create a modern responsive navigation bar with keyboard navigation, mobile menu, active-route styling, and accessible focus states
   ```
4. Treat generated code as editable project code: inspect it, adapt imports and conventions, and verify behavior rather than blindly accepting it.
5. Break complex interfaces into smaller components when that improves maintainability.
6. Run the project’s relevant lint, typecheck, test, and build checks after integration.

## Capabilities

- Natural-language AI-powered UI component generation.
- Components inspired by the 21st.dev library and compatible with modern frontend projects.
- React and TypeScript-oriented workflows with customizable generated source.
- Component previews and integration into the existing codebase.
- SVGL access for professional brand assets and logos when available.
- IDE integrations for Cursor, Windsurf, VS Code, Cline, and Claude-compatible MCP clients.

## MCP setup reference

The recommended CLI setup is:

```bash
npx @21st-dev/cli@latest install <client> --api-key <key>
```

Supported client values include `cursor`, `windsurf`, `cline`, and `claude`.

For manual MCP configuration, keep API keys out of repository files and use the client’s secret or environment-variable mechanism. A generic configuration is:

```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "${MAGIC_API_KEY}"
      }
    }
  }
}
```

Never request or record a user’s API key in chat, source files, logs, or committed configuration. If setup requires sign-in or secret entry, direct the user to enter it in the appropriate IDE or settings UI.

## VS Code configuration

VS Code supports MCP inputs so the key can be prompted securely. User settings or `.vscode/mcp.json` can define an `apiKey` prompt input and pass it as `${input:apiKey}` to the `API_KEY` environment variable. Prefer the official one-click installer or the current 21st.dev documentation when available because client configuration formats can change.

## Integration and quality rules

- Do not overwrite unrelated files or existing components.
- Match the project’s framework, TypeScript settings, CSS strategy, naming, and import aliases.
- Check generated dependencies before adding them; do not install packages without a clear need.
- Preserve accessibility: semantic HTML, labels, keyboard support, visible focus states, appropriate contrast, and accessible names for icon-only controls.
- Use consistent SVG icons rather than emoji UI icons.
- Review responsive behavior, loading states, error states, and reduced-motion behavior.
- Verify generated component imports, client/server boundaries, routing, and event handlers.
- Treat generated output as untrusted code until it passes project checks and a user-facing behavior review.

## Useful request patterns

- `/ui create ...` — generate a new component or page.
- Describe an existing component and request a focused enhancement while naming the file and constraints.
- Ask for a responsive variant with explicit breakpoints and mobile interaction behavior.
- Ask for an accessible variant with keyboard navigation, ARIA requirements, and reduced-motion support.

## Security and beta considerations

Magic is an external AI/MCP service. Do not send private credentials, secrets, or unrelated sensitive source code to it. Review generated changes before committing. Availability, pricing, generation limits, supported clients, and installation syntax may change; verify current details from official 21st.dev documentation when the user asks for the latest information.
