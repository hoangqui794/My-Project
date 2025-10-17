import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const initSignalR = (hubUrl: string, accessTokenFactory?: (() => string | Promise<string>)) => {
    if (connection) return connection;
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, { accessTokenFactory: accessTokenFactory ?? (() => '') })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

    connection.onclose((err) => {
        if (err) console.warn('SignalR closed with error:', err);
    });

    return connection;
};

export const startSignalR = async () => {
    if (!connection) throw new Error('SignalR not initialized.');
    if (connection.state === signalR.HubConnectionState.Connected) return connection;
    await connection.start();
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