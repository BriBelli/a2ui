import { html, TemplateResult, nothing } from 'lit';
import type { A2UIResponse, A2UIComponent } from '@a2ui/core';

/**
 * A2UI Renderer for Lit Web Components
 * 
 * This service maps A2UI protocol components to their
 * Lit Web Component implementations.
 */
export class A2UIRenderer {
  /**
   * Render an A2UI response to Lit templates
   */
  static render(response: A2UIResponse): TemplateResult {
    if (!response || !response.components) {
      return html`${nothing}`;
    }

    return html`
      <div class="a2ui-root">
        ${response.components.map(c => this.renderComponent(c))}
      </div>
    `;
  }

  /**
   * Render a single A2UI component
   */
  static renderComponent(component: A2UIComponent): TemplateResult {
    const { type, id, props = {}, children = [] } = component;

    // Render children recursively
    const renderedChildren = children.map(child => this.renderComponent(child));

    switch (type) {
      case 'text':
        return html`
          <a2ui-text
            .id=${id}
            .content=${props.content || ''}
            .variant=${props.variant || 'body'}
          ></a2ui-text>
        `;

      case 'container':
        return html`
          <a2ui-container
            .id=${id}
            .layout=${props.layout || 'vertical'}
            .gap=${props.gap || 'md'}
            .wrap=${props.wrap || false}
          >
            ${renderedChildren}
          </a2ui-container>
        `;

      case 'card':
        return html`
          <a2ui-card
            .id=${id}
            .cardTitle=${props.title || ''}
            .subtitle=${props.subtitle || ''}
          >
            ${renderedChildren}
          </a2ui-card>
        `;

      case 'list':
        return html`
          <a2ui-list
            .id=${id}
            .items=${props.items || []}
            .variant=${props.variant || 'default'}
          ></a2ui-list>
        `;

      case 'data-table':
        return html`
          <a2ui-data-table
            .id=${id}
            .columns=${props.columns || []}
            .data=${props.data || []}
          ></a2ui-data-table>
        `;

      case 'chart':
        return html`
          <a2ui-chart
            .id=${id}
            .chartType=${props.chartType || 'bar'}
            .title=${props.title || ''}
            .data=${props.data || {}}
            .options=${props.options || {}}
          ></a2ui-chart>
        `;

      case 'link':
        return html`
          <a2ui-link
            .id=${id}
            .href=${props.href || '#'}
            .text=${props.text || ''}
            .external=${props.external || false}
          ></a2ui-link>
        `;

      case 'chip':
        return html`
          <a2ui-chip
            .id=${id}
            .label=${props.label || ''}
            .variant=${props.variant || 'default'}
            .clickable=${props.clickable || false}
          ></a2ui-chip>
        `;

      case 'button':
        return html`
          <a2ui-button
            .id=${id}
            .label=${props.label || ''}
            .variant=${props.variant || 'default'}
            .disabled=${props.disabled || false}
          ></a2ui-button>
        `;

      default:
        console.warn(`Unknown A2UI component type: ${type}`);
        return html`
          <div class="a2ui-unknown">
            Unknown component: ${type}
          </div>
        `;
    }
  }
}
