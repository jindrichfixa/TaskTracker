import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Paintbrush } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          aria-label="Change theme"
        >
          <Paintbrush className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${theme === 'default' ? 'bg-gray-100' : ''}`} 
          onClick={() => setTheme('default')}
        >
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${theme === 'pink' ? 'bg-gray-100' : ''}`}
          onClick={() => setTheme('pink')}
        >
          <div className="w-4 h-4 rounded-full bg-pink-400"></div>
          Pink
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}