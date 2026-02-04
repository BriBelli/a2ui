import React, { useState } from 'react';
import type { A2UIResponse, A2UIEvent } from '@a2ui/core';
import { A2UIRenderer } from '@a2ui/react';
import { sampleResponses } from './samples';

export default function App() {
  const [selectedSample, setSelectedSample] = useState<string>('restaurant-finder');
  const [events, setEvents] = useState<A2UIEvent[]>([]);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [showDevTools, setShowDevTools] = useState<boolean>(true);

  const currentResponse = sampleResponses[selectedSample];

  const handleEvent = (componentId: string, event: string, payload?: Record<string, unknown>) => {
    const newEvent: A2UIEvent = {
      type: event,
      componentId,
      payload,
      timestamp: Date.now(),
    };
    setEvents((prev) => [...prev.slice(-9), newEvent]);
    console.log('A2UI Event:', newEvent);
  };

  const handleDataChange = (newData: Record<string, unknown>) => {
    setData(newData);
    console.log('A2UI Data:', newData);
  };

  return (
    <div className={`app ${showDevTools ? '' : 'clean-mode'}`}>
      <header className="header">
        <div className="header-content">
          <div>
            <h1>A2UI Demo</h1>
            <p>Agent-to-User Interface Renderer</p>
          </div>
          <button 
            className="dev-toggle"
            onClick={() => setShowDevTools(!showDevTools)}
          >
            {showDevTools ? '🎨 Clean View' : '🛠️ Dev Tools'}
          </button>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h2>Samples</h2>
          <nav className="sample-nav">
            {Object.keys(sampleResponses).map((key) => (
              <button
                key={key}
                className={`sample-btn ${selectedSample === key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSample(key);
                  setEvents([]);
                  setData({});
                }}
              >
                {key.replace(/-/g, ' ')}
              </button>
            ))}
          </nav>

          {showDevTools && (
            <>
              <h2>Events Log</h2>
              <div className="events-log">
                {events.length === 0 ? (
                  <p className="no-events">No events yet</p>
                ) : (
                  events.map((evt, i) => (
                    <div key={i} className="event-item">
                      <span className="event-type">{evt.type}</span>
                      <span className="event-component">{evt.componentId}</span>
                      {evt.payload && (
                        <pre className="event-payload">
                          {JSON.stringify(evt.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>

              <h2>Data Model</h2>
              <pre className="data-model">
                {JSON.stringify(data, null, 2) || '{}'}
              </pre>
            </>
          )}
        </aside>

        <main className="preview">
          <div className="preview-header">
            <h2>{selectedSample.replace(/-/g, ' ')}</h2>
          </div>
          <div className="preview-content">
            {currentResponse && (
              <A2UIRenderer
                key={selectedSample}
                response={currentResponse}
                onEvent={handleEvent}
                onDataChange={handleDataChange}
              />
            )}
          </div>
        </main>

        {showDevTools && (
          <aside className="json-panel">
            <h2>A2UI JSON</h2>
            <pre className="json-code">
              {JSON.stringify(currentResponse, null, 2)}
            </pre>
          </aside>
        )}
      </div>
    </div>
  );
}
