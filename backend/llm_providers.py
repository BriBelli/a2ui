"""
LLM Providers for A2UI

Supports multiple AI providers:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3.5, Claude 3)
- Google (Gemini Pro, Gemini Flash)

Each provider can generate A2UI JSON responses.
"""

import os
import json
from typing import Any, Dict, List, Optional
from abc import ABC, abstractmethod

# A2UI Schema definition for LLM context
A2UI_SCHEMA = """
A2UI is a declarative JSON protocol for UI. You MUST respond with valid JSON containing:

{
  "text": "Optional plain text explanation",
  "a2ui": {
    "version": "1.0",
    "components": [...]
  }
}

Available component types:

1. text - Display text
   props: { content: string, variant: "h1"|"h2"|"h3"|"body"|"caption"|"label"|"code" }

2. container - Layout container
   props: { layout: "vertical"|"horizontal", gap: "none"|"xs"|"sm"|"md"|"lg"|"xl", wrap: boolean }
   children: [components...]

3. card - Card with optional title
   props: { title?: string, subtitle?: string }
   children: [components...]

4. list - List of items
   props: { 
     items: [{ id: string, text: string, status?: "pending"|"in-progress"|"completed", subtitle?: string }],
     variant: "default"|"bullet"|"numbered"|"checklist"
   }

5. data-table - Data table
   props: {
     columns: [{ key: string, label: string, width?: string, align?: "left"|"center"|"right" }],
     data: [{ [key]: value }...]
   }
   Required: columns[].key, columns[].label, data. Optional: width, align.
   When using align: "left" for text (default), "right" for numbers, "center" only for short labels.

6. chart - Chart visualization (bar, line, pie, doughnut)
   props: {
     chartType: "bar"|"line"|"pie"|"doughnut",
     title?: string,
     data: {
       labels: string[],
       datasets: [{ label: string, data: number[], backgroundColor?: string|string[], borderColor?: string }]
     },
     options?: { height?: number }
   }

7. button - Clickable button
   props: { label: string, variant?: "default"|"primary"|"outlined"|"text"|"danger" }

8. chip - Tag/chip
   props: { label: string, variant?: "default"|"primary"|"success"|"warning"|"error" }

9. link - Hyperlink
   props: { href: string, text: string, external?: boolean }

10. image - Image display
    props: { src: string, alt: string, caption?: string }
    Note: For placeholder images, use URLs like "https://picsum.photos/200" or leave src empty for a placeholder icon

RULES:
- Always include an "id" field for each component (use descriptive kebab-case)
- Use appropriate component types for the data being displayed
- For tabular data, use data-table
- For comparisons or trends, use chart
- For lists of items, use list with appropriate variant
- Wrap related components in a container
- Keep responses concise but informative
"""

SYSTEM_PROMPT = f"""You respond using A2UI JSON protocol. Be concise but helpful.

{A2UI_SCHEMA}

RESPONSE RULES:
1. Simple questions (greetings, short facts) → use just "text" field, maybe one text component
2. Complex topics → use cards with lists for organization
3. Comparisons → use data-table
4. Data/stats → use chart
5. ALWAYS return valid JSON only - no markdown, no extra text
6. ALWAYS include "id" on every component

Example simple response:
{{"text": "Hello! How can I help?", "a2ui": {{"version": "1.0", "components": [{{"id": "greeting", "type": "text", "props": {{"content": "I'm ready to assist you.", "variant": "body"}}}}]}}}}

Example complex response structure:
{{"text": "Brief intro", "a2ui": {{"version": "1.0", "components": [{{"id": "main-card", "type": "card", "props": {{"title": "Topic"}}, "children": [{{"id": "info", "type": "text", "props": {{"content": "Details...", "variant": "body"}}}}, {{"id": "points", "type": "list", "props": {{"variant": "bullet", "items": [{{"id": "p1", "text": "Point 1"}}, {{"id": "p2", "text": "Point 2"}}]}}}}]}}]}}}}

Match response complexity to question complexity. Use real data, not placeholders."""


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    name: str
    models: List[Dict[str, str]]
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if this provider is configured and available."""
        pass
    
    @abstractmethod
    async def generate(self, message: str, model: str) -> Dict[str, Any]:
        """Generate a response for the given message."""
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI GPT provider."""
    
    name = "OpenAI"
    models = [
        {"id": "gpt-4o", "name": "GPT-4o"},
        {"id": "gpt-4-turbo", "name": "GPT-4 Turbo"},
        {"id": "gpt-4", "name": "GPT-4"},
        {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo"},
    ]
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    async def generate(self, message: str, model: str = "gpt-4o") -> Dict[str, Any]:
        import openai
        
        client = openai.OpenAI(api_key=self.api_key)
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message}
            ],
            max_tokens=2000,
            temperature=0.7,
        )
        
        content = response.choices[0].message.content.strip()
        return self._parse_response(content)
    
    def _parse_response(self, content: str) -> Dict[str, Any]:
        """Parse LLM response, handling potential JSON formatting issues."""
        # Remove markdown code fences if present
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # If parsing fails, return as plain text
            return {"text": content}


class AnthropicProvider(LLMProvider):
    """Anthropic Claude provider."""
    
    name = "Anthropic"
    models = [
        {"id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4"},
        {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet"},
        {"id": "claude-3-5-haiku-20241022", "name": "Claude 3.5 Haiku (Fast)"},
        {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus"},
    ]
    
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    async def generate(self, message: str, model: str = "claude-sonnet-4-20250514") -> Dict[str, Any]:
        import anthropic
        
        client = anthropic.Anthropic(api_key=self.api_key)
        
        response = client.messages.create(
            model=model,
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": message}
            ]
        )
        
        content = response.content[0].text.strip()
        return self._parse_response(content)
    
    def _parse_response(self, content: str) -> Dict[str, Any]:
        """Parse LLM response, handling potential JSON formatting issues."""
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"text": content}


class GeminiProvider(LLMProvider):
    """Google Gemini provider."""
    
    name = "Google"
    models = [
        {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash"},
        {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro"},
        {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
    ]
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    async def generate(self, message: str, model: str = "gemini-2.0-flash") -> Dict[str, Any]:
        import google.generativeai as genai
        
        genai.configure(api_key=self.api_key)
        
        gen_model = genai.GenerativeModel(
            model_name=model,
            system_instruction=SYSTEM_PROMPT
        )
        
        response = gen_model.generate_content(message)
        content = response.text.strip()
        return self._parse_response(content)
    
    def _parse_response(self, content: str) -> Dict[str, Any]:
        """Parse LLM response, handling potential JSON formatting issues."""
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"text": content}


class LLMService:
    """Service for managing LLM providers."""
    
    def __init__(self):
        self.providers = {
            "openai": OpenAIProvider(),
            "anthropic": AnthropicProvider(),
            "gemini": GeminiProvider(),
        }
    
    def get_available_providers(self) -> List[Dict[str, Any]]:
        """Get list of available providers and their models."""
        available = []
        for key, provider in self.providers.items():
            if provider.is_available():
                available.append({
                    "id": key,
                    "name": provider.name,
                    "models": provider.models,
                })
        return available
    
    def get_provider(self, provider_id: str) -> Optional[LLMProvider]:
        """Get a specific provider by ID."""
        provider = self.providers.get(provider_id)
        if provider and provider.is_available():
            return provider
        return None
    
    async def generate(self, message: str, provider_id: str, model: str) -> Dict[str, Any]:
        """Generate a response using the specified provider and model."""
        provider = self.get_provider(provider_id)
        if not provider:
            raise ValueError(f"Provider '{provider_id}' is not available")
        
        return await provider.generate(message, model)


# Global instance
llm_service = LLMService()
