import IconButton from '@/components/elements/button/IconButton';
import IconLink from '@/components/elements/link/IconLink';
import HeaderLayout from '@/components/layout/HeaderLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutButton from '@/features/auth/components/elements/button/LogoutButton';
import ThemeToggleButton from '@/features/navItems/components/elements/button/ThemeToggleButton';
import { HEADER_NAV_ITEMS } from '@/utils/data/navItems';
import React from 'react';
import { TbMenuDeep } from 'react-icons/tb';
import AddFashionContentSheet from '../elements/sheet/addFashionContentSheet';

const Header = () => {
  return (
    <HeaderLayout>
      {/* Link関連のナブアイテム */}
      {HEADER_NAV_ITEMS.map((item, index) => (
        <React.Fragment key={index}>
          <IconLink
            href={item.href}
            Icon={item.icon}
            label={item.label}
            rounded={true}
            showText={false}
          />
          {/* 追加ボタン（真ん中に配置） */}
          {index === 1 && <AddFashionContentSheet />}
        </React.Fragment>
      ))}
      {/* その他のメニュー */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            Icon={TbMenuDeep}
            label="Menu"
            showText={false}
            rounded={true}
            variant="ghost"
            type="button"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
              {/* ダークモード切り替えボタン */}
              <ThemeToggleButton />
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* ログアウトボタン */}
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </HeaderLayout>
  );
};

export default Header;
