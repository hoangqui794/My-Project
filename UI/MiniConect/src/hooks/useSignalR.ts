import { useEffect } from 'react';
import { initSignalR, startSignalR, stopSignalR, onSignalREvent, offSignalREvent } from '../utils/signalR';
import { useAuthStore } from '../store/authStore';

type Handlers = Record<string, (...args: any[]) => void>;

export function useSignalR(hubUrl: string, handlers: Handlers) {
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
        if (!token) {
            stopSignalR().catch(() => { });
            return;
        }
        // Pass a function returning the token (sync or async)
        initSignalR(hubUrl, () => token);
        let mounted = true;
        (async () => {
            try {
                await startSignalR();
                if (!mounted) return;
                Object.entries(handlers).forEach(([event, fn]) => onSignalREvent(event, fn));
            } catch (err) {
                console.error('SignalR start failed', err);
            }
        })();

        return () => {
            mounted = false;
            Object.entries(handlers).forEach(([event, fn]) => offSignalREvent(event, fn));
            stopSignalR().catch(() => { });
        };
    }, [token, hubUrl, ...Object.values(handlers)]);
}
