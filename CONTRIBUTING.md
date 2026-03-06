# Contributing to GenIUS (Agenticum G5)

First off, thank you for considering contributing to **GenIUS**! It’s people like you that make the autonomous agent ecosystem such an exciting space.

This project was built for the **Google Gemini Live Agents Developer Challenge**, and we follow strict "Mission Excellence" standards.

## 📜 Code of Conduct

While we don't have a formal document yet, the rule is simple: **Be excellent to each other.** We are building the future of work; let's keep it professional, inclusive, and focused on agentic innovation.

## 🚀 How Can I Contribute?

### Reporting Bugs

- Use the **GitHub Issues** tab.
- Provide a clear title and description.
- Include steps to reproduce the bug (especially if it involves the Gemini Live API).
- Mention your environment (Chrome version, OS, etc.).

### Suggesting Enhancements

- Open an Issue with the tag `enhancement`.
- Describe the "Agentic Value": How does this improve the swarm's performance or user ROI?

### Pull Requests

1. **Fork the repo** and create your branch from `main`.
2. **Setup the environment**: Follow the setup guide in the `README.md`.
3. **Coding Standards**:
   - Use TypeScript for all frontend and Node.js backend code.
   - Follow the **Glassmorphism v2.0** design system for UI components.
   - Maintain 100% linting compliance.
4. **Testing**: Ensure your changes don't break the `launch_swarm` function declarations or the 16kHz audio stream logic.
5. **Documentation**: Update the `AGENTICUM_SSOT.md` if you are changing core architecture.

## 🎨 Design Language

We use a specific aesthetic called **Obsidian Cyber**. If you are adding UI components:

- Use **Tailwind CSS v4**.
- Stick to the brand colors: `Cyan-400` (Accents), `Purple-500` (Neural Flow), `Emerald-400` (Compliance).
- Use `framer-motion` for fluid transitions.

## 🤖 Neural Protocol (Gemini Live API)

If you are modifying the interaction layer:

- Ensure all tool definitions are correctly typed for Gemini function calling.
- Keep latency to a minimum; any overhead in the `AudioWorklet` processing will affect the real-time feel.

---

**GenIUS Matrix Status: OPEN FOR SYNERGY.**
