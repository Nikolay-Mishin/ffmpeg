import { log } from 'console';
import { WebSocketServer } from 'ws';

// Сервер

const server = new WebSocketServer({ port: 8080 });
server.on('connection', (socket) => {
    log('Новое соединение установлено');
    socket.on('message', (message) => {
        log(`Получено сообщение: ${message}`);
        socket.send(message);
    });
    socket.on('close', () => {
        log('Соединение закрыто');
    });
});
log('Сервер WebSocket запущен на порту 8080');
