import IconButton from '@/components/elements/button/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Pencil } from 'lucide-react';
import type { ProfileImageActionsProps } from '../../types';

const ProfileImageDropdownMenu: React.FC<ProfileImageActionsProps> = ({
  onDeleteImage,
  hasImage,
  hasPreview,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton
        Icon={Pencil}
        label="アップロード"
        showText={false}
        rounded={true}
        type="button"
        className="absolute bottom-0 -right-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700"
        size="md"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <label htmlFor="image-upload">
        <DropdownMenuItem className="px-3">
          <span>カメラロールから選択</span>
        </DropdownMenuItem>
      </label>
      {(hasPreview || hasImage) && (
        <DropdownMenuItem className="px-3" onClick={onDeleteImage}>
          <span className="text-red-500">{hasPreview ? '選択取り消し' : '削除'}</span>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
export default ProfileImageDropdownMenu;
