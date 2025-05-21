import { cn, getInitials, stringToColor } from '../../lib/utils';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'idle' | 'dnd' | 'offline' | null;
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };
  
  const initials = getInitials(alt);
  const backgroundColor = stringToColor(alt);
  
  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'rounded-full object-cover',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium text-white',
            sizes[size]
          )}
          style={{ backgroundColor }}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span 
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-gray-900',
            statusSizes[size],
            status === 'online' && 'bg-green-500',
            status === 'idle' && 'bg-yellow-500',
            status === 'dnd' && 'bg-red-500',
            status === 'offline' && 'bg-gray-500'
          )}
        ></span>
      )}
    </div>
  );
}