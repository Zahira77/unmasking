import { useEffect, useRef, useState } from "react";

export interface RealtimeEvent {
  event: string;
  entity: string;
  action: string;
  id?: number;
  timestamp?: string;
}

export function useRealtimeSync(
  entityFilter?: string | string[],
  onUpdate?: (event: RealtimeEvent) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isUnmounted = false;

    let retryCount = 0;
    const MAX_RETRIES = 3;

    function connect() {
      if (isUnmounted) return;

      let wsUrl: string | null = null;
      const apiEnv = import.meta.env.VITE_API_URL;
      if (apiEnv) {
        const cleanUrl = apiEnv.replace(/\/+$/, "");
        const wsBase = cleanUrl.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");
        wsUrl = `${wsBase}/api/ws/content`;
      } else if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ) {
        // Only attempt relative WebSocket on localhost development
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host;
        wsUrl = `${protocol}//${host}/api/ws/content`;
      }

      // If no remote backend URL is provided and not on localhost, WebSocket is unavailable
      if (!wsUrl) {
        return;
      }

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (!isUnmounted) {
            setIsConnected(true);
            retryCount = 0;
            ws?.send("ping");
          }
        };

        ws.onmessage = (event) => {
          if (event.data === "pong") return;
          try {
            const data: RealtimeEvent = JSON.parse(event.data);
            if (data.event === "content_updated") {
              const matchesFilter =
                !entityFilter ||
                entityFilter === "all" ||
                data.entity === "all" ||
                (Array.isArray(entityFilter)
                  ? entityFilter.includes(data.entity)
                  : entityFilter === data.entity);

              if (matchesFilter) {
                setLastEvent(data);
                if (callbackRef.current) {
                  callbackRef.current(data);
                }
              }
            }
          } catch {
            // Non-JSON message ignored
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            setIsConnected(false);
            if (retryCount < MAX_RETRIES) {
              retryCount += 1;
              const delay = Math.min(3000 * Math.pow(2, retryCount - 1), 30000);
              reconnectTimeout = setTimeout(connect, delay);
            }
          }
        };

        ws.onerror = () => {
          try {
            ws?.close();
          } catch {}
        };
      } catch (err) {
        if (!isUnmounted) {
          setIsConnected(false);
          if (retryCount < MAX_RETRIES) {
            retryCount += 1;
            const delay = Math.min(3000 * Math.pow(2, retryCount - 1), 30000);
            reconnectTimeout = setTimeout(connect, delay);
          }
        }
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, [Array.isArray(entityFilter) ? entityFilter.join(",") : entityFilter]);

  return { isConnected, lastEvent };
}
