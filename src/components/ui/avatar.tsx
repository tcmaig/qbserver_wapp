import * as React from 'react'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
}

const iconSizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [error, setError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-gray-100',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : fallback ? (
          <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
            {fallback}
          </span>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-gray-400">
            <User size={iconSizeMap[size]} />
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
