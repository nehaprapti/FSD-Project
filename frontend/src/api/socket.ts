/// <reference types="vite/client" />
import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  public socket: Socket | null = null;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;
    const token = sessionStorage.getItem('token');
    
    this.socket = io(URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('socket:error', (err) => {
      console.error('Socket error:', err);
    });

    // Re-attach all listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(cb => this.socket?.on(event, cb));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any, callback?: Function) {
    if (!this.socket) this.connect();
    this.socket!.emit(event, data, callback);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.listeners.has(event)) {
      if (callback) {
        this.listeners.set(event, this.listeners.get(event)!.filter(cb => cb !== callback));
      } else {
        this.listeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
