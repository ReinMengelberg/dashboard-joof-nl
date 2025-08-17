import NotificationService from "~/services/utils/NotificationService";

class ErrorService {
    public returnFalse(error: any, message: string): boolean {
        if (error === 'warning') {
            NotificationService.showWarning(message)
        } else if (error === 'error') {
            NotificationService.showError(message)
        } else if (error.code === 422 || error.code === 404 || error.code === 403 || error.code === 401 || error.code === 400) {
            NotificationService.showWarning(error.message, 5000)
        } else {
            console.error(error)
            NotificationService.showError(message)
        }
        return false
    }

    public returnNull(error: any, message: string): null {
        if (error === 'warning') {
            NotificationService.showWarning(message)
        } else if (error === 'error') {
            NotificationService.showError(message)
        } else if (error.code === 422 || error.code === 404 || error.code === 403 || error.code === 401 || error.code === 400) {
            console.error(error)
            NotificationService.showWarning(error.message, 5000)
        } else {
            console.error(error)
            NotificationService.showError(message)
        }
        return null
    }

    public logError(error: any, message: string): void {
        if (error === 'warning') {
            NotificationService.showWarning(message)
        } else if (error === 'error') {
            NotificationService.showError(message)
        } else if (error.code === 422 || error.code === 404 || error.code === 403 || error.code === 401 || error.code === 400) {
            console.error(error)
            NotificationService.showWarning(error.message, 5000)
        } else {
            console.error(error)
            NotificationService.showError(message)
        }
        return
    }
}

const ErrorServiceInstance = new ErrorService();
export default ErrorServiceInstance;