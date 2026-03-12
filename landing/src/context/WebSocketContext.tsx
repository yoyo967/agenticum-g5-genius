import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL } from '../config';
import { WS_RECONNECT_INTERVAL } from '../constants';

export interface AgentStatus {
  id: string;
  name: string;
  color: string;
  state: string;
  lastStatus: string;
  progress: number;
}

export interface WSEvent {
  type: string;
  agentId?: string;
  agent?: AgentStatus & { subAgents?: Record<string, AgentStatus> };
  data?: unknown;
  payload?: unknown;
  payloadType?: string;
  from?: string;
  to?: string;
  stats?: {
    total_latency: number;
    [key: string]: unknown;
  };
  protocol?: {
    id: string;
    goal: string;
    status: string;
  };
  task?: {
    id: string;
    agentId: string;
    state: string;
    description: string;
    result?: string;
  };
  thought?: string;
  lastStatus?: string;
  message?: string;
  state?: unknown;
  text?: string;
  campaignType?: string;
  mimeType?: string;
  metric?: string;
  value?: unknown;
}

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'active' | 'error';
  send: (data: string | object) => void;
  lastMessage: WSEvent | null;
  subscribe: (type: string, callback: (data: WSEvent) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'active' | 'error'>('connecting');
  const [lastMessage, setLastMessage] = useState<WSEvent | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const listeners = useRef<Map<string, Set<(data: WSEvent) => void>>>(new Map());
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

    setConnectionState('connecting');
    console.log('🔌 Connecting to Neural Event Fabric:', WS_BASE_URL);

    try {
      const socket = new WebSocket(WS_BASE_URL);
      ws.current = socket;

      socket.onopen = () => {
        setConnectionState('connected');
        console.log('✅ Neural Event Fabric Online');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const data: WSEvent = JSON.parse(event.data);
          setLastMessage(data);

          // Wildcard dispatch
          listeners.current.get('*')?.forEach(callback => callback(data));

          // Dispatch to specific listeners by type
          if (data.type && listeners.current.has(data.type)) {
            listeners.current.get(data.type)?.forEach(callback => callback(data));
          }

          // Legacy event broadcasting
          window.dispatchEvent(new CustomEvent(`ws-${data.type}`, { detail: data }));
          
          const legacyEventMap: Record<string, string> = {
            'status': 'swarm-status',
            'swarm-payload': 'swarm-payload',
            'swarm-senate': 'swarm-senate',
            'swarm-metric': 'swarm-metric',
            'swarm-telemetry': 'swarm-telemetry',
            'agent-thought': 'agent-thought',
            'nexus-state-update': 'nexus-world-state',
            'task-update': 'task-update',
            'awaiting-intervention': 'swarm-intervention',
            'calibration': 'swarm-calibration'
          };

          if (legacyEventMap[data.type]) {
            window.dispatchEvent(new CustomEvent(legacyEventMap[data.type], { detail: data.agent || data.state || data.data || data }));
          }

          if (['task-update', 'agent-thought', 'status', 'protocol-activated', 'senate', 'swarm-payload'].includes(data.type)) {
             window.dispatchEvent(new CustomEvent('swarm-dispatch', {
               detail: {
                 agentId: data.agentId || data.agent?.id || 'SN-00',
                 action: data.type.toUpperCase(),
                 detail: data.thought || data.lastStatus || data.payloadType || data.type
               }
             }));
          }

        } catch (err) {
          console.error('[FABRIC] Parse Error:', err);
        }
      };

      socket.onclose = () => {
        setConnectionState('disconnected');
        console.log('❌ Neural Event Fabric Offline - Reconnecting...');
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectRef.current();
          }, WS_RECONNECT_INTERVAL);
        }
      };

      socket.onerror = (err) => {
        setConnectionState('error');
        console.error('[FABRIC] Connectivity Error:', err);
      };

    } catch (err) {
      setConnectionState('error');
      console.error('[FABRIC] Initialization Failed:', err);
    }
  }, []);

  // Maintain connectRef without violating render rules
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    const t = setTimeout(() => connect(), 0);
    return () => {
      clearTimeout(t);
      if (ws.current) ws.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  const send = useCallback((data: string | object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('[FABRIC] Attempted to send message while disconnected');
    }
  }, []);

  const subscribe = useCallback((type: string, callback: (data: WSEvent) => void) => {
    if (!listeners.current.has(type)) {
      listeners.current.set(type, new Set());
    }
    listeners.current.get(type)?.add(callback);
    return () => {
      listeners.current.get(type)?.delete(callback);
    };
  }, []);

  const value = {
    isConnected: connectionState === 'connected' || connectionState === 'active',
    connectionState,
    send,
    lastMessage,
    subscribe
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
