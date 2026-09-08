import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/helpers';

const typeIcon = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
};

const typeColor = {
  info: 'text-blue-500',
  warning: 'text-amber-500',
  success: 'text-emerald-500',
  error: 'text-red-500',
};

export default function NotificationsBell() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationService.getForUser(user!.id),
    enabled: !!user?.id,
    refetchInterval: 60_000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await notificationService.markAllAsRead(user.id);
    queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await notificationService.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full transition-colors hover:bg-accent text-muted-foreground"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium flex items-center gap-1 text-primary hover:opacity-80"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcon[n.type] || Info;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.is_read)}
                    className={cn(
                      'w-full text-left px-4 py-3 flex gap-3 border-b border-border last:border-0 transition-colors hover:bg-accent',
                      !n.is_read && 'bg-primary/5'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', typeColor[n.type])} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-foreground">{n.title}</p>
                      <p className="text-xs line-clamp-2 text-muted-foreground">{n.message}</p>
                      <p className="text-[11px] mt-0.5 text-muted-foreground">
                        {formatRelativeTime(n.created_at)}
                      </p>
                    </div>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
