import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('a2ui-image')
export class A2UIImage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .image-container {
      position: relative;
      overflow: hidden;
      border-radius: var(--a2ui-radius-md);
      background: var(--a2ui-bg-tertiary);
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
      transition: opacity var(--a2ui-transition-normal);
    }

    img.loading {
      opacity: 0;
    }

    img.loaded {
      opacity: 1;
    }

    img.error {
      display: none;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(135deg, var(--a2ui-bg-tertiary), var(--a2ui-bg-elevated));
      color: var(--a2ui-text-tertiary);
      font-size: var(--a2ui-text-2xl);
    }

    .caption {
      margin-top: var(--a2ui-space-2);
      font-size: var(--a2ui-text-sm);
      color: var(--a2ui-text-secondary);
      text-align: center;
    }
  `;

  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: String }) caption = '';
  @property({ type: String }) fallbackIcon = '🖼️';

  @state() private loadState: 'loading' | 'loaded' | 'error' = 'loading';

  private handleLoad() {
    this.loadState = 'loaded';
  }

  private handleError() {
    this.loadState = 'error';
  }

  render() {
    const showPlaceholder = !this.src || this.loadState === 'error';

    return html`
      <div class="image-container">
        ${showPlaceholder ? html`
          <div class="placeholder">
            ${this.fallbackIcon}
          </div>
        ` : html`
          <img
            class=${this.loadState}
            src=${this.src}
            alt=${this.alt}
            @load=${this.handleLoad}
            @error=${this.handleError}
          />
        `}
      </div>
      ${this.caption ? html`
        <div class="caption">${this.caption}</div>
      ` : ''}
    `;
  }
}
