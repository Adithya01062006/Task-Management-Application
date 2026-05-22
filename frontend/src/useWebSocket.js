import { useEffect, useRef, useState } from 'react';

export default function useWebSocket(onMessage) {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      ws.current = new WebSocket(`${proto}://${location.host}`);
      ws.current.onopen = () => setConnected(true);
      ws.current.onclose = () => { setConnected(false); setTimeout(connect, 3000); };
      ws.current.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch {} };
    };
    connect();
    return () => ws.current?.close();
  }, []);

  return connected;
}
