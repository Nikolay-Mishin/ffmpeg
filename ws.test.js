import { log } from 'console';
import WebSocket from 'ws';

// Клиент

const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
    log('Соединение установлено');
    socket.send('Соединение установлено');
};
socket.onmessage = (event) => {
    log(`Сервер: ${event.data}`);
};
socket.onclose = () => {
    log('Соединение закрыто');
    socket.send('Соединение закрыто');
};
