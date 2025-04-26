import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className={cn("animate-spin rounded-full border-t-transparent border-primary", sizeClasses[size])}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={cn("animate-spin rounded-full border-t-transparent border-primary", sizeClasses[size])}></div>
    </div>
  );
};

export default LoadingSpinner;
