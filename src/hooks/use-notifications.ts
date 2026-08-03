import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações locais.');
      return false;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        toast.success('Notificações ativadas com sucesso!');
        return true;
      } else {
        toast.error('Permissão para notificações negada.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const scheduleTaskReminder = (title: string, timeStr: string, taskId: string) => {
    if (permission !== 'granted') return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    let timeToWait = scheduledTime.getTime() - now.getTime();
    
    // If the time already passed today, don't schedule for today
    if (timeToWait < 0) {
      return; 
    }

    // Agendamento local via setTimeout e verificação de Service Worker ativo para notificações PWA em primeiro plano/aba ativa.
    setTimeout(() => {
      showNotification('Lembrete de Tarefa', {
        body: `Está na hora de: ${title}`,
        icon: '/pwa-192x192.png',
        tag: `task-${taskId}`,
      });
    }, timeToWait);
    
    toast("Lembrete ativado", {
      description: "O lembrete disparará enquanto o app estiver aberto em primeiro plano."
    });
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, options);
        } catch (e) {
          new Notification(title, options);
        }
      } else {
        new Notification(title, options);
      }
    }
  };

  return {
    permission,
    requestPermission,
    scheduleTaskReminder,
    showNotification
  };
}
