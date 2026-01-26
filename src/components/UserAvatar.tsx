import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

export const UserAvatar = ({ avatarUrl, username, size = 'md' }: UserAvatarProps) => {
  const initials = username
    ? username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <Avatar className={`${sizeClasses[size]} rounded-none border border-foreground`}>
      {avatarUrl && (
        <AvatarImage src={avatarUrl} alt={username || 'User avatar'} className="object-cover" />
      )}
      <AvatarFallback className="rounded-none bg-muted font-mono text-xs uppercase">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
