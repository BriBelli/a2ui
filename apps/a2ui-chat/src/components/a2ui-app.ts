import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { A2UIResponse } from '@a2ui/core';
import { ChatService, type ChatMessage } from '../services/chat-service';

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
      height: var(--a2ui-header-height);
      padding: 0 var(--a2ui-space-6);
      background: var(--a2ui-bg-primary);
      border-bottom: 1px solid var(--a2ui-border-subtle);
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

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  `;

  @state() private messages: ChatMessage[] = [];
  @state() private isLoading = false;

  private chatService = new ChatService();

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
      const response = await this.chatService.sendMessage(message);
      
      // Add AI response
      this.messages = [...this.messages, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text || '',
        a2ui: response.a2ui,
        timestamp: Date.now(),
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

  render() {
    return html`
      <header class="header">
        <div class="logo">
          <div class="logo-icon"></div>
          <span>A2UI Chat</span>
        </div>
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
