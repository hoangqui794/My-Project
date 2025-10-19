import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const initSignalR = (hubUrl: string, accessTokenFactory?: (() => string | Promise<string>)) => {
    if (connection) return connection;
    // Đảm bảo accessTokenFactory luôn trả về chuỗi hoặc Promise<string>
    const tokenFactory = async () => {
        const raw = accessTokenFactory ? await accessTokenFactory() : localStorage.getItem('token') || '';
        if (typeof raw === 'string') return raw;
        if (raw && typeof raw === 'object' && 'token' in raw) return String((raw as any).token);
        return '';
    };
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, { accessTokenFactory: tokenFactory })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

    connection.onclose((err) => {
        if (err) {
            console.warn('SignalR closed with error:', err);
        } else {
            console.log('SignalR connection closed normally.');
        }
    });

    connection.onreconnecting((err) => {
        console.warn('SignalR reconnecting...', err);
    });

    connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected. ConnectionId:', connectionId);
    });

    console.log('SignalR connection initialized. State:', connection.state);
    return connection;
};

export const startSignalR = async () => {
    if (!connection) throw new Error('SignalR not initialized.');
    if (connection.state !== signalR.HubConnectionState.Disconnected) {
        await stopSignalR();
    }
    try {
        await connection.start();
        console.log('SignalR connected! State:', connection.state);
    } catch (err) {
        console.error('SignalR failed to connect:', err);
    }
    return connection;
};

export const stopSignalR = async () => {
    if (!connection) return;
    await connection.stop();
    connection = null;
};

export const onSignalREvent = (eventName: string, handler: (...args: any[]) => void) => {
    connection?.on(eventName, handler);
};

export const offSignalREvent = (eventName: string, handler?: (...args: any[]) => void) => {
    if (handler) connection?.off(eventName, handler);
    else connection?.off(eventName);
};

export const invokeSignalR = async (methodName: string, ...args: any[]) => {
    if (!connection) throw new Error('SignalR not initialized.');
    return connection.invoke(methodName, ...args);
};

export const getSignalRConnection = () => connection;