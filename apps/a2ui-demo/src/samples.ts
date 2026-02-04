import type { A2UIResponse } from '@a2ui/core';

/**
 * Sample A2UI Responses for demonstration
 */
export const sampleResponses: Record<string, A2UIResponse> = {
  'restaurant-finder': {
    version: '0.8',
    root: 'root',
    components: [
      {
        id: 'root',
        type: 'container',
        props: { direction: 'column', gap: '16px' },
        children: ['header', 'search-card', 'results'],
      },
      {
        id: 'header',
        type: 'text',
        props: {
          content: '🍽️ Restaurant Finder',
          variant: 'heading',
        },
      },
      {
        id: 'search-card',
        type: 'card',
        props: {
          title: 'Find a Restaurant',
          subtitle: 'Search for restaurants near you',
        },
        children: ['search-form'],
      },
      {
        id: 'search-form',
        type: 'container',
        props: { direction: 'column', gap: '12px' },
        children: ['cuisine-select', 'location-input', 'price-chips', 'search-btn'],
      },
      {
        id: 'cuisine-select',
        type: 'select',
        props: {
          label: 'Cuisine Type',
          placeholder: 'Select a cuisine',
          options: [
            { value: 'italian', label: 'Italian' },
            { value: 'japanese', label: 'Japanese' },
            { value: 'mexican', label: 'Mexican' },
            { value: 'indian', label: 'Indian' },
            { value: 'american', label: 'American' },
          ],
        },
        bindings: { value: 'cuisine' },
      },
      {
        id: 'location-input',
        type: 'text-field',
        props: {
          label: 'Location',
          placeholder: 'Enter your location...',
        },
        bindings: { value: 'location' },
      },
      {
        id: 'price-chips',
        type: 'container',
        props: { direction: 'row', gap: '8px', wrap: true },
        children: ['chip-1', 'chip-2', 'chip-3', 'chip-4'],
      },
      {
        id: 'chip-1',
        type: 'chip',
        props: { label: '$', variant: 'outlined' },
      },
      {
        id: 'chip-2',
        type: 'chip',
        props: { label: '$$', variant: 'outlined' },
      },
      {
        id: 'chip-3',
        type: 'chip',
        props: { label: '$$$', variant: 'outlined' },
      },
      {
        id: 'chip-4',
        type: 'chip',
        props: { label: '$$$$', variant: 'outlined' },
      },
      {
        id: 'search-btn',
        type: 'button',
        props: { label: 'Search Restaurants', variant: 'filled' },
        events: {
          click: { type: 'submit', payload: { form: 'restaurant-search' } },
        },
      },
      {
        id: 'results',
        type: 'container',
        props: { direction: 'column', gap: '12px' },
        children: ['results-header', 'result-1', 'result-2'],
      },
      {
        id: 'results-header',
        type: 'text',
        props: { content: 'Popular Restaurants', variant: 'label', size: 'lg' },
      },
      {
        id: 'result-1',
        type: 'card',
        props: {
          title: 'La Bella Italia',
          subtitle: '⭐ 4.8 • Italian • $$ • 0.5 mi',
          outlined: true,
        },
        children: ['result-1-actions'],
      },
      {
        id: 'result-1-actions',
        type: 'container',
        props: { direction: 'row', gap: '8px' },
        children: ['result-1-view', 'result-1-reserve'],
      },
      {
        id: 'result-1-view',
        type: 'button',
        props: { label: 'View Menu', variant: 'text' },
      },
      {
        id: 'result-1-reserve',
        type: 'button',
        props: { label: 'Reserve', variant: 'filled' },
      },
      {
        id: 'result-2',
        type: 'card',
        props: {
          title: 'Tokyo Garden',
          subtitle: '⭐ 4.6 • Japanese • $$$ • 1.2 mi',
          outlined: true,
        },
        children: ['result-2-actions'],
      },
      {
        id: 'result-2-actions',
        type: 'container',
        props: { direction: 'row', gap: '8px' },
        children: ['result-2-view', 'result-2-reserve'],
      },
      {
        id: 'result-2-view',
        type: 'button',
        props: { label: 'View Menu', variant: 'text' },
      },
      {
        id: 'result-2-reserve',
        type: 'button',
        props: { label: 'Reserve', variant: 'filled' },
      },
    ],
    data: {
      cuisine: '',
      location: '',
    },
  },

  'booking-form': {
    version: '0.8',
    root: 'root',
    components: [
      {
        id: 'root',
        type: 'card',
        props: {
          title: '✈️ Flight Booking',
          subtitle: 'Book your next adventure',
          elevation: 2,
        },
        children: ['form'],
      },
      {
        id: 'form',
        type: 'container',
        props: { direction: 'column', gap: '16px' },
        children: ['trip-type', 'destinations', 'dates', 'passengers', 'divider', 'submit'],
      },
      {
        id: 'trip-type',
        type: 'container',
        props: { direction: 'row', gap: '8px' },
        children: ['chip-round', 'chip-one-way', 'chip-multi'],
      },
      {
        id: 'chip-round',
        type: 'chip',
        props: { label: 'Round Trip', variant: 'filled', selected: true },
      },
      {
        id: 'chip-one-way',
        type: 'chip',
        props: { label: 'One Way', variant: 'outlined' },
      },
      {
        id: 'chip-multi',
        type: 'chip',
        props: { label: 'Multi-City', variant: 'outlined' },
      },
      {
        id: 'destinations',
        type: 'container',
        props: { direction: 'row', gap: '12px' },
        children: ['from-field', 'to-field'],
      },
      {
        id: 'from-field',
        type: 'text-field',
        props: { label: 'From', placeholder: 'Departure city' },
        bindings: { value: 'from' },
      },
      {
        id: 'to-field',
        type: 'text-field',
        props: { label: 'To', placeholder: 'Destination city' },
        bindings: { value: 'to' },
      },
      {
        id: 'dates',
        type: 'container',
        props: { direction: 'row', gap: '12px' },
        children: ['depart-date', 'return-date'],
      },
      {
        id: 'depart-date',
        type: 'text-field',
        props: { label: 'Departure', type: 'text', placeholder: 'Select date' },
        bindings: { value: 'departDate' },
      },
      {
        id: 'return-date',
        type: 'text-field',
        props: { label: 'Return', type: 'text', placeholder: 'Select date' },
        bindings: { value: 'returnDate' },
      },
      {
        id: 'passengers',
        type: 'select',
        props: {
          label: 'Passengers',
          options: [
            { value: '1', label: '1 Adult' },
            { value: '2', label: '2 Adults' },
            { value: '3', label: '3 Adults' },
            { value: '4', label: '4 Adults' },
          ],
        },
        bindings: { value: 'passengers' },
      },
      {
        id: 'divider',
        type: 'divider',
        props: {},
      },
      {
        id: 'submit',
        type: 'button',
        props: { label: 'Search Flights', variant: 'filled' },
      },
    ],
    data: {
      from: '',
      to: '',
      departDate: '',
      returnDate: '',
      passengers: '1',
    },
  },

  'settings-panel': {
    version: '0.8',
    root: 'root',
    components: [
      {
        id: 'root',
        type: 'container',
        props: { direction: 'column', gap: '20px' },
        children: ['header', 'notifications-card', 'privacy-card', 'theme-card'],
      },
      {
        id: 'header',
        type: 'text',
        props: { content: '⚙️ Settings', variant: 'heading' },
      },
      {
        id: 'notifications-card',
        type: 'card',
        props: { title: 'Notifications', outlined: true },
        children: ['notif-settings'],
      },
      {
        id: 'notif-settings',
        type: 'container',
        props: { direction: 'column', gap: '12px' },
        children: ['email-notif', 'push-notif', 'marketing-notif'],
      },
      {
        id: 'email-notif',
        type: 'checkbox',
        props: { label: 'Email notifications', checked: true },
        bindings: { checked: 'emailNotifications' },
      },
      {
        id: 'push-notif',
        type: 'checkbox',
        props: { label: 'Push notifications', checked: true },
        bindings: { checked: 'pushNotifications' },
      },
      {
        id: 'marketing-notif',
        type: 'checkbox',
        props: { label: 'Marketing emails', checked: false },
        bindings: { checked: 'marketingEmails' },
      },
      {
        id: 'privacy-card',
        type: 'card',
        props: { title: 'Privacy', outlined: true },
        children: ['privacy-settings'],
      },
      {
        id: 'privacy-settings',
        type: 'container',
        props: { direction: 'column', gap: '12px' },
        children: ['profile-visibility', 'activity-status'],
      },
      {
        id: 'profile-visibility',
        type: 'select',
        props: {
          label: 'Profile Visibility',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'private', label: 'Private' },
          ],
        },
        bindings: { value: 'profileVisibility' },
      },
      {
        id: 'activity-status',
        type: 'checkbox',
        props: { label: 'Show activity status', checked: true },
        bindings: { checked: 'activityStatus' },
      },
      {
        id: 'theme-card',
        type: 'card',
        props: { title: 'Appearance', outlined: true },
        children: ['theme-settings'],
      },
      {
        id: 'theme-settings',
        type: 'container',
        props: { direction: 'column', gap: '12px' },
        children: ['theme-label', 'theme-chips'],
      },
      {
        id: 'theme-label',
        type: 'text',
        props: { content: 'Theme', variant: 'label' },
      },
      {
        id: 'theme-chips',
        type: 'container',
        props: { direction: 'row', gap: '8px' },
        children: ['theme-light', 'theme-dark', 'theme-auto'],
      },
      {
        id: 'theme-light',
        type: 'chip',
        props: { label: '☀️ Light', variant: 'outlined', selected: true },
      },
      {
        id: 'theme-dark',
        type: 'chip',
        props: { label: '🌙 Dark', variant: 'outlined' },
      },
      {
        id: 'theme-auto',
        type: 'chip',
        props: { label: '🔄 Auto', variant: 'outlined' },
      },
    ],
    data: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      profileVisibility: 'friends',
      activityStatus: true,
    },
  },

  'loading-states': {
    version: '0.8',
    root: 'root',
    components: [
      {
        id: 'root',
        type: 'container',
        props: { direction: 'column', gap: '24px' },
        children: ['header', 'progress-section', 'buttons-section'],
      },
      {
        id: 'header',
        type: 'text',
        props: { content: '⏳ Loading States Demo', variant: 'heading' },
      },
      {
        id: 'progress-section',
        type: 'card',
        props: { title: 'Progress Indicators', outlined: true },
        children: ['progress-content'],
      },
      {
        id: 'progress-content',
        type: 'container',
        props: { direction: 'column', gap: '16px' },
        children: ['linear-label', 'linear-progress', 'linear-label-2', 'linear-progress-2', 'circular-row'],
      },
      {
        id: 'linear-label',
        type: 'text',
        props: { content: 'Determinate Progress (75%)', variant: 'caption' },
      },
      {
        id: 'linear-progress',
        type: 'progress',
        props: { value: 75, variant: 'linear' },
      },
      {
        id: 'linear-label-2',
        type: 'text',
        props: { content: 'Indeterminate Progress', variant: 'caption' },
      },
      {
        id: 'linear-progress-2',
        type: 'progress',
        props: { variant: 'linear', indeterminate: true },
      },
      {
        id: 'circular-row',
        type: 'container',
        props: { direction: 'row', gap: '24px', align: 'center' },
        children: ['circular-1', 'circular-text', 'circular-2', 'circular-text-2'],
      },
      {
        id: 'circular-1',
        type: 'progress',
        props: { value: 60, variant: 'circular' },
      },
      {
        id: 'circular-text',
        type: 'text',
        props: { content: '60%', variant: 'caption' },
      },
      {
        id: 'circular-2',
        type: 'progress',
        props: { variant: 'circular', indeterminate: true },
      },
      {
        id: 'circular-text-2',
        type: 'text',
        props: { content: 'Loading...', variant: 'caption' },
      },
      {
        id: 'buttons-section',
        type: 'card',
        props: { title: 'Button States', outlined: true },
        children: ['buttons-content'],
      },
      {
        id: 'buttons-content',
        type: 'container',
        props: { direction: 'row', gap: '12px', wrap: true },
        children: ['btn-normal', 'btn-loading', 'btn-disabled'],
      },
      {
        id: 'btn-normal',
        type: 'button',
        props: { label: 'Normal', variant: 'filled' },
      },
      {
        id: 'btn-loading',
        type: 'button',
        props: { label: 'Loading...', variant: 'filled', loading: true },
      },
      {
        id: 'btn-disabled',
        type: 'button',
        props: { label: 'Disabled', variant: 'filled', disabled: true },
      },
    ],
    data: {},
  },
};
