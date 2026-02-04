import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ChatMessage } from '../../services/chat-service';
import { A2UIRenderer } from '../../services/a2ui-renderer';

@customElement('a2ui-chat-message')
export class A2UIChatMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: var(--a2ui-space-6);
    }

    .message {
      display: flex;
      gap: var(--a2ui-space-3);
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--a2ui-radius-full);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--a2ui-text-sm);
      font-weight: var(--a2ui-font-medium);
    }

    .avatar.user {
      background: var(--a2ui-accent);
      color: var(--a2ui-text-inverse);
    }

    .avatar.assistant {
      background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853);
      color: white;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .user .content {
      display: flex;
      justify-content: flex-end;
    }

    .bubble {
      padding: var(--a2ui-space-3) var(--a2ui-space-4);
      border-radius: var(--a2ui-radius-xl);
      max-width: 100%;
    }

    .user .bubble {
      background: var(--a2ui-accent);
      color: var(--a2ui-text-inverse);
      border-bottom-right-radius: var(--a2ui-radius-sm);
    }

    .assistant .bubble {
      background: var(--a2ui-bg-secondary);
      color: var(--a2ui-text-primary);
      border-bottom-left-radius: var(--a2ui-radius-sm);
    }

    .text-content {
      white-space: pre-wrap;
      word-break: break-word;
      line-height: var(--a2ui-leading-relaxed);
    }

    .a2ui-content {
      margin-top: var(--a2ui-space-3);
    }

    .timestamp {
      margin-top: var(--a2ui-space-1);
      font-size: var(--a2ui-text-xs);
      color: var(--a2ui-text-tertiary);
    }

    .user .timestamp {
      text-align: right;
    }
  `;

  @property({ type: Object }) message!: ChatMessage;

  private formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  render() {
    const { role, content, a2ui, timestamp } = this.message;
    const isUser = role === 'user';

    return html`
      <div class="message ${role}">
        <div class="avatar ${role}">
          ${isUser ? 'U' : 'AI'}
        </div>
        <div class="content">
          ${isUser ? html`
            <div class="bubble">
              <div class="text-content">${content}</div>
            </div>
          ` : html`
            <div class="bubble">
              ${content ? html`
                <div class="text-content">${content}</div>
              ` : ''}
              ${a2ui ? html`
                <div class="a2ui-content">
                  ${A2UIRenderer.render(a2ui)}
                </div>
              ` : ''}
            </div>
          `}
          <div class="timestamp">${this.formatTime(timestamp)}</div>
        </div>
      </div>
    `;
  }
}
