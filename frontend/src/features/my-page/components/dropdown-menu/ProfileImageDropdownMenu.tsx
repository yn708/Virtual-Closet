import IconButton from '@/components/elements/button/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AiFillDelete, AiOutlinePicture } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import type { ProfileImageActionsProps } from '../../types';

const ProfileImageDropdownMenu: React.FC<ProfileImageActionsProps> = ({
  onDeleteImage,
  hasImage,
  hasPreview,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton
        Icon={MdEdit}
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
          <AiOutlinePicture />
          <span>カメラロールから選択</span>
        </DropdownMenuItem>
      </label>
      {(hasPreview || hasImage) && (
        <DropdownMenuItem className="px-3" onClick={onDeleteImage}>
          <AiFillDelete className="text-red-500" />
          <span className="text-red-500">{hasPreview ? '選択取り消し' : '削除'}</span>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
export default ProfileImageDropdownMenu;
