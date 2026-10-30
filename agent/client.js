// agent/client.js - Unified NVIDIA Nemotron API client
// Supports both NVIDIA NIM (build.nvidia.com) and Nebius Token Factory

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.LLM_BASE_URL || "https://integrate.api.nvidia.com/v1";
const API_KEY = process.env.LLM_API_KEY;
const MODEL = process.env.LLM_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b";

const REQUEST_TIMEOUT_MS = 120_000; // 2 minutes
const MAX_RETRIES = 1;              // 1 retry on transient failures

// Status codes worth retrying
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

/**
 * Send a chat completion request to Nemotron.
 * Returns { reasoning, content, usage }
 */
export async function chatCompletion(messages, { maxTokens = 8192, temperature = 0.3 } = {}) {
  if (!API_KEY) {
    throw new Error("LLM_API_KEY is not set. Check your .env file.");
  }

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.detail || data?.message || JSON.stringify(data);
        const err = new Error(`API Error (${res.status}): ${errMsg}`);
        err.status = res.status;

        // Retry on transient/server errors, bail on client errors (except 429)
        if (!RETRYABLE_STATUS.has(res.status)) {
          throw err;
        }

        lastError = err;
        if (attempt < MAX_RETRIES) {
          // Back off longer for rate limits
          const backoff = res.status === 429 ? 5000 : 2000;
          console.log(`[Retry ${attempt + 1}/${MAX_RETRIES}] ${res.status} — waiting ${backoff}ms...`);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
        throw lastError;
      }

      const choice = data.choices?.[0];
      return {
        reasoning: choice?.message?.reasoning_content || null,
        content: choice?.message?.content || "",
        usage: data.usage || {},
        model: data.model,
      };
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError") {
        lastError = new Error(
          `API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. The model may be under heavy load — try again.`
        );
      } else {
        lastError = err;
      }

      // Don't retry client errors (already thrown above) or final attempt
      if (attempt >= MAX_RETRIES) break;

      // Only retry network/timeout errors
      if (err.name === "AbortError" || err.code === "ECONNRESET" || err.cause) {
        console.log(`[Retry ${attempt + 1}/${MAX_RETRIES}] ${lastError.message}`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      break;
    }
  }

  throw lastError;
}

export { BASE_URL, MODEL };
