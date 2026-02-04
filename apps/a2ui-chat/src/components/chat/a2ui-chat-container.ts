import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { ChatMessage } from '../../services/chat-service';

@customElement('a2ui-chat-container')
export class A2UIChatContainer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--a2ui-bg-app);
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: var(--a2ui-space-6) 0;
    }

    .messages-wrapper {
      max-width: var(--a2ui-chat-max-width);
      margin: 0 auto;
      padding: 0 var(--a2ui-space-4);
    }

    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: var(--a2ui-space-8);
    }

    .welcome-title {
      font-size: var(--a2ui-text-3xl);
      font-weight: var(--a2ui-font-medium);
      color: var(--a2ui-text-primary);
      margin-bottom: var(--a2ui-space-3);
    }

    .welcome-subtitle {
      font-size: var(--a2ui-text-lg);
      color: var(--a2ui-text-secondary);
      max-width: 500px;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--a2ui-space-2);
      margin-top: var(--a2ui-space-6);
      justify-content: center;
    }

    .suggestion {
      padding: var(--a2ui-space-2) var(--a2ui-space-4);
      background: var(--a2ui-bg-secondary);
      border: 1px solid var(--a2ui-border-default);
      border-radius: var(--a2ui-radius-full);
      color: var(--a2ui-text-primary);
      font-size: var(--a2ui-text-sm);
      cursor: pointer;
      transition: all var(--a2ui-transition-fast);
    }

    .suggestion:hover {
      background: var(--a2ui-bg-tertiary);
      border-color: var(--a2ui-accent);
    }

    .input-container {
      padding: var(--a2ui-space-4);
      background: var(--a2ui-bg-primary);
      border-top: 1px solid var(--a2ui-border-subtle);
    }

    .input-wrapper {
      max-width: var(--a2ui-chat-max-width);
      margin: 0 auto;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: var(--a2ui-space-2);
      padding: var(--a2ui-space-4);
      color: var(--a2ui-text-secondary);
      font-size: var(--a2ui-text-sm);
    }

    .loading-dots {
      display: flex;
      gap: 4px;
    }

    .loading-dot {
      width: 6px;
      height: 6px;
      background: var(--a2ui-accent);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }
    .loading-dot:nth-child(3) { animation-delay: 0; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;

  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) isLoading = false;

  @query('.messages-container') private messagesContainer!: HTMLElement;

  private suggestions = [
    'Top 5 trending stocks',
    'Show weather forecast',
    'Explain machine learning',
    'Create a task list',
  ];

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      if (this.messagesContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    });
  }

  private handleSuggestionClick(suggestion: string) {
    this.dispatchEvent(new CustomEvent('send-message', {
      detail: { message: suggestion },
      bubbles: true,
      composed: true,
    }));
  }

  private handleSendMessage(e: CustomEvent<{ message: string }>) {
    this.dispatchEvent(new CustomEvent('send-message', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const hasMessages = this.messages.length > 0;

    return html`
      <div class="messages-container">
        ${hasMessages ? html`
          <div class="messages-wrapper">
            ${this.messages.map(msg => html`
              <a2ui-chat-message
                .message=${msg}
              ></a2ui-chat-message>
            `)}
            ${this.isLoading ? html`
              <div class="loading">
                <div class="loading-dots">
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                </div>
                <span>Thinking...</span>
              </div>
            ` : ''}
          </div>
        ` : html`
          <div class="welcome">
            <h1 class="welcome-title">Hello! How can I help you today?</h1>
            <p class="welcome-subtitle">
              Ask me anything. I can search the web, analyze data, create charts, and more.
            </p>
            <div class="suggestions">
              ${this.suggestions.map(s => html`
                <button class="suggestion" @click=${() => this.handleSuggestionClick(s)}>
                  ${s}
                </button>
              `)}
            </div>
          </div>
        `}
      </div>
      
      <div class="input-container">
        <div class="input-wrapper">
          <a2ui-chat-input
            ?disabled=${this.isLoading}
            @send-message=${this.handleSendMessage}
          ></a2ui-chat-input>
        </div>
      </div>
    `;
  }
}
