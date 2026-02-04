import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

interface ChartOptions {
  height?: number;
}

@customElement('a2ui-chart')
export class A2UIChart extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .chart-container {
      background: var(--a2ui-bg-tertiary);
      border-radius: var(--a2ui-radius-lg);
      padding: var(--a2ui-space-4);
    }

    .chart-title {
      font-size: var(--a2ui-text-md);
      font-weight: var(--a2ui-font-medium);
      color: var(--a2ui-text-primary);
      margin-bottom: var(--a2ui-space-3);
    }

    .chart-wrapper {
      position: relative;
    }

    canvas {
      width: 100% !important;
    }
  `;

  @property({ type: String }) chartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  @property({ type: String }) title = '';
  @property({ type: Object }) data: ChartData = { labels: [], datasets: [] };
  @property({ type: Object }) options: ChartOptions = {};

  @query('canvas') private canvas!: HTMLCanvasElement;
  @state() private chart?: Chart;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.chart?.destroy();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('data') || changedProperties.has('chartType')) {
      this.renderChart();
    }
  }

  private renderChart() {
    if (!this.canvas) return;

    // Destroy existing chart
    this.chart?.destroy();

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Apply default dark theme colors
    const defaultColors = [
      '#8ab4f8',
      '#81c995',
      '#f28b82',
      '#fdd663',
      '#c58af9',
      '#78d9ec',
      '#ff8bcb',
    ];

    const datasets = this.data.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || defaultColors[i % defaultColors.length],
      borderColor: ds.borderColor || defaultColors[i % defaultColors.length],
      borderWidth: ds.borderWidth || (this.chartType === 'line' ? 2 : 0),
      tension: this.chartType === 'line' ? 0.3 : undefined,
      fill: false,
    }));

    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.data.labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9aa0a6',
              padding: 16,
              font: {
                family: 'Google Sans, Roboto, sans-serif',
                size: 12,
              },
            },
          },
        },
        scales: this.chartType !== 'pie' && this.chartType !== 'doughnut' ? {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#9aa0a6',
              font: {
                family: 'Google Sans, Roboto, sans-serif',
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#9aa0a6',
              font: {
                family: 'Google Sans, Roboto, sans-serif',
              },
            },
          },
        } : undefined,
      },
    });
  }

  firstUpdated() {
    this.renderChart();
  }

  render() {
    const height = this.options.height || 200;

    return html`
      <div class="chart-container">
        ${this.title ? html`
          <div class="chart-title">${this.title}</div>
        ` : ''}
        <div class="chart-wrapper" style="height: ${height}px">
          <canvas></canvas>
        </div>
      </div>
    `;
  }
}
