import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { A2UIResponse } from '@a2ui/core';
import { ChatService, type ChatMessage, type LLMProvider } from '../services/chat-service';

@customElement('a2ui-app')
export class A2UIApp extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--a2ui-bg-app);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--a2ui-header-height);
      padding: 0 var(--a2ui-space-6);
      background: var(--a2ui-bg-primary);
      border-bottom: 1px solid var(--a2ui-border-subtle);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--a2ui-space-4);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--a2ui-space-2);
      font-size: var(--a2ui-text-xl);
      font-weight: var(--a2ui-font-medium);
      color: var(--a2ui-text-primary);
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853);
      border-radius: var(--a2ui-radius-md);
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--a2ui-border-default);
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      gap: var(--a2ui-space-1);
      padding: var(--a2ui-space-2) var(--a2ui-space-3);
      background: transparent;
      border: 1px solid var(--a2ui-border-default);
      border-radius: var(--a2ui-radius-md);
      color: var(--a2ui-text-secondary);
      font-family: var(--a2ui-font-family);
      font-size: var(--a2ui-text-sm);
      cursor: pointer;
      transition: all var(--a2ui-transition-fast);
    }

    .clear-btn:hover {
      background: var(--a2ui-bg-hover);
      color: var(--a2ui-text-primary);
      border-color: var(--a2ui-accent);
    }
  `;

  @state() private messages: ChatMessage[] = [];
  @state() private isLoading = false;
  @state() private providers: LLMProvider[] = [];
  @state() private selectedProvider = '';
  @state() private selectedModel = '';

  private chatService = new ChatService();

  async connectedCallback() {
    super.connectedCallback();
    await this.loadProviders();
  }

  private async loadProviders() {
    this.providers = await this.chatService.getProviders();
    
    // Auto-select first provider and model
    if (this.providers.length > 0) {
      this.selectedProvider = this.providers[0].id;
      this.selectedModel = this.providers[0].models[0]?.id || '';
    }
  }

  private handleModelChange(e: CustomEvent<{ provider: string; model: string }>) {
    this.selectedProvider = e.detail.provider;
    this.selectedModel = e.detail.model;
  }

  private async handleSendMessage(e: CustomEvent<{ message: string }>) {
    const { message } = e.detail;
    if (!message.trim()) return;

    // Add user message
    this.messages = [...this.messages, {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }];

    this.isLoading = true;

    try {
      // Pass current messages for conversation history
      const response = await this.chatService.sendMessage(
        message,
        this.selectedProvider,
        this.selectedModel,
        this.messages
      );
      
      // Get model name for display
      const provider = this.providers.find(p => p.id === this.selectedProvider);
      const model = provider?.models.find(m => m.id === this.selectedModel);
      
      // Add AI response
      this.messages = [...this.messages, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text || '',
        a2ui: response.a2ui,
        timestamp: Date.now(),
        model: model?.name || this.selectedModel,
      }];
    } catch (error) {
      console.error('Chat error:', error);
      this.messages = [...this.messages, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: Date.now(),
      }];
    } finally {
      this.isLoading = false;
    }
  }

  private clearChat() {
    this.messages = [];
  }

  render() {
    return html`
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <div class="logo-icon"></div>
            <span>A2UI Chat</span>
          </div>
          <div class="divider"></div>
          <a2ui-model-selector
            .providers=${this.providers}
            .selectedProvider=${this.selectedProvider}
            .selectedModel=${this.selectedModel}
            @model-change=${this.handleModelChange}
          ></a2ui-model-selector>
        </div>
        
        ${this.messages.length > 0 ? html`
          <button class="clear-btn" @click=${this.clearChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Clear
          </button>
        ` : ''}
      </header>
      
      <main class="main">
        <a2ui-chat-container
          .messages=${this.messages}
          .isLoading=${this.isLoading}
          @send-message=${this.handleSendMessage}
        ></a2ui-chat-container>
      </main>
    `;
  }
}
