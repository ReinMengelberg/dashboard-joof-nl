import mitt from 'mitt';

export type NotificationType = 'success' | 'error' | 'info' | 'warning'
    | 'email' | 'chat' ;

export interface NotificationEvent {
    type: NotificationType;
    message: string;
    duration?: number;
    sender?: string;
    link?: string;
}

type NotificationEvents = {
    notify: NotificationEvent;
};

class NotificationService {
    private emitter = mitt<NotificationEvents>();

    /**
     * Show a notification.
     * @param message The message to display.
     * @param duration How long (in ms) the notification should be visible.
     */
    public showSuccess(message: string, duration = 5000): void {
        this.emitter.emit('notify', { type: 'success', message, duration });
    }

    public showInfo(message: string, duration = 5000): void {
        this.emitter.emit('notify', { type: 'info', message, duration });
    }

    public showWarning(message: string, duration = 5000): void {
        console.log('showWarning', message);
        this.emitter.emit('notify', { type: 'warning', message, duration });
    }

    public showValidationWarning(errors: any, duration = 5000): void {
        const errorFields = Object.keys(errors).join(", ");
        const message = `Validation errors in fields: ${errorFields}`;
        this.emitter.emit('notify', { type: 'warning', message, duration });
    }

    public showError(message: string, duration = 5000): void {
        this.emitter.emit('notify', { type: 'error', message, duration });
    }

    public showEmail(sender: string, message: string, link: string, duration = 10000): void {
        this.emitter.emit('notify', { type: 'email', sender, message, link, duration });
    }

    public showChat(sender: string, message: string, link: string, duration = 10000): void {
        this.emitter.emit('notify', { type: 'chat', sender, message, link, duration });
    }

    // If needed, you can add more methods for other notification types:
    // public showError(message: string, duration = 5000): void { ... }
    // public showInfo(message: string, duration = 5000): void { ... }

    /**
     * Register a callback to be invoked when a notification is emitted.
     * @param callback The callback function.
     */
    public onNotify(callback: (payload: NotificationEvent) => void): void {
        this.emitter.on('notify', callback);
    }

    /**
     * Unregister a previously registered notification callback.
     * @param callback The callback function to remove.
     */
    public offNotify(callback: (payload: NotificationEvent) => void): void {
        this.emitter.off('notify', callback);
    }
}

// Export the instance so you can import it anywhere in your app.
const NotificationServiceInstance = new NotificationService();
export default NotificationServiceInstance;