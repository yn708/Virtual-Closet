'use client';
import IconButton from '@/components/elements/button/IconButton';
import { MonitorSmartphone, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_OPTIONS: Theme[] = ['light', 'system', 'dark'];

const THEME_ICONS: Record<Theme, React.ComponentProps<typeof IconButton>['Icon']> = {
  light: Sun,
  system: MonitorSmartphone,
  dark: Moon,
};

const ThemeToggleButton: React.FC = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = useCallback(
    (newTheme: Theme) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setTheme(newTheme);
    },
    [setTheme],
  );

  const getButtonClass = (buttonTheme: Theme): string => {
    return `p-2 rounded-full ${
      theme === buttonTheme ? 'bg-accent text-accent-foreground' : 'text-foreground'
    }`;
  };

  const renderThemeButton = (themeOption: Theme) => (
    <IconButton
      key={themeOption}
      Icon={THEME_ICONS[themeOption]}
      label={`${themeOption} mode`}
      showText={false}
      rounded={true}
      variant="ghost"
      onClick={handleThemeChange(themeOption)}
      className={getButtonClass(themeOption)}
      size="sm"
      aria-label={`Switch to ${themeOption} mode`}
    />
  );

  return (
    <div
      className="w-full flex items-center justify-center space-x-4"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {THEME_OPTIONS.map(renderThemeButton)}
    </div>
  );
};

export default ThemeToggleButton;
