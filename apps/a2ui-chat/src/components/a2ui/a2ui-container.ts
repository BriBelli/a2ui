import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('a2ui-container')
export class A2UIContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
    }

    .vertical {
      flex-direction: column;
    }

    .horizontal {
      flex-direction: row;
    }

    .wrap {
      flex-wrap: wrap;
    }

    .gap-none { gap: 0; }
    .gap-xs { gap: var(--a2ui-space-1); }
    .gap-sm { gap: var(--a2ui-space-2); }
    .gap-md { gap: var(--a2ui-space-4); }
    .gap-lg { gap: var(--a2ui-space-6); }
    .gap-xl { gap: var(--a2ui-space-8); }

    .align-start { align-items: flex-start; }
    .align-center { align-items: center; }
    .align-end { align-items: flex-end; }
    .align-stretch { align-items: stretch; }

    .justify-start { justify-content: flex-start; }
    .justify-center { justify-content: center; }
    .justify-end { justify-content: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-around { justify-content: space-around; }
  `;

  @property({ type: String }) layout: 'vertical' | 'horizontal' = 'vertical';
  @property({ type: String }) gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @property({ type: Boolean }) wrap = false;
  @property({ type: String }) align: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  @property({ type: String }) justify: 'start' | 'center' | 'end' | 'between' | 'around' = 'start';

  render() {
    const classes = [
      'container',
      this.layout,
      `gap-${this.gap}`,
      `align-${this.align}`,
      `justify-${this.justify}`,
      this.wrap ? 'wrap' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div class=${classes}>
        <slot></slot>
      </div>
    `;
  }
}
