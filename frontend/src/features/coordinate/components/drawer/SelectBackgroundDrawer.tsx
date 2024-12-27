import IconButton from '@/components/elements/button/IconButton';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import ThemeToggleButton from '@/features/navItems/components/elements/button/ThemeToggleButton';
import { BG_COLOR } from '@/utils/data/selectData';
import { TbBackground } from 'react-icons/tb';
import type { SelectBackgroundProps } from '../../types';

const SelectBackgroundDrawer: React.FC<SelectBackgroundProps> = ({
  onBackgroundChange,
  background,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <IconButton
          Icon={TbBackground}
          label="背景"
          size="lg"
          variant="ghost"
          className="flex-col h-auto gap-0"
          labelClassName="opacity-60"
        />
      </DrawerTrigger>
      <DrawerContent className="w-full mx-auto min-h-48">
        <div className="max-w-3xl mx-auto py-8 px-4 md:px-8 space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {BG_COLOR.map((color) => (
              <DrawerClose key={color.value}>
                <button
                  onClick={() => onBackgroundChange(color.value)}
                  className={`size-12 md:size-16 ${color.value} rounded-xl 
            ${background === color.value ? 'ring-2 ring-offset-2 ring-gray-700' : ''}
            border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]
            transition-transform hover:scale-105`}
                />
              </DrawerClose>
            ))}
          </div>
          {/* ダークモード選択ボタン */}
          <ThemeToggleButton />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectBackgroundDrawer;
