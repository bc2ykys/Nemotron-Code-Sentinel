// agent/analyzer.js - Core analysis orchestrator
// Routes code through the appropriate Nemotron prompt pipeline

import { chatCompletion } from "./client.js";
import { buildPrompt, AVAILABLE_MODES } from "./prompts.js";

/**
 * Run a single analysis mode on the provided code.
 * Returns { mode, reasoning, report, usage, model, timestamp }
 */
export async function analyzeCode(code, mode, language) {
  if (!code || !code.trim()) {
    throw new Error("No code provided for analysis.");
  }

  if (!AVAILABLE_MODES.find((m) => m.id === mode)) {
    throw new Error(`Invalid mode "${mode}". Use: ${AVAILABLE_MODES.map((m) => m.id).join(", ")}`);
  }

  const messages = buildPrompt(mode, code, language);

  const startTime = Date.now();
  const result = await chatCompletion(messages, {
    maxTokens: 8192,
    temperature: mode === "patch" ? 0.2 : 0.3,
  });
  const elapsed = Date.now() - startTime;

  return {
    mode,
    modeLabel: AVAILABLE_MODES.find((m) => m.id === mode)?.label || mode,
    reasoning: result.reasoning,
    report: result.content,
    usage: result.usage,
    model: result.model,
    elapsed_ms: elapsed,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run ALL analysis modes sequentially on the same code.
 * Returns an array of results.
 */
export async function fullScan(code, language) {
  const results = [];
  for (const mode of AVAILABLE_MODES) {
    const result = await analyzeCode(code, mode.id, language);
    results.push(result);
  }
  return results;
}

export { AVAILABLE_MODES };
