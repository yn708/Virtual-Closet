'use client';

import { FashionItemsProvider } from '@/context/FashionItemsContext';
import type {
  OnResetProps,
  OnSelectItemType,
  SelectBackgroundProps,
  SelectedItemsType,
} from '../../types';
import ResetDialog from '../dialog/ResetDialog';
import AddItemsDrawer from '../drawer/AddItemsDrawer';
import SelectBackgroundDrawer from '../drawer/SelectBackgroundDrawer';

const Footer: React.FC<
  SelectedItemsType & OnSelectItemType & OnResetProps & SelectBackgroundProps
> = ({ selectedItems, onSelectItem, onReset, onBackgroundChange, background }) => {
  return (
    <FashionItemsProvider>
      <div className="flex items-center justify-around pt-5 pb-2 w-full">
        {selectedItems?.length > 0 && <ResetDialog onReset={onReset} />}
        <SelectBackgroundDrawer onBackgroundChange={onBackgroundChange} background={background} />
        <AddItemsDrawer selectedItems={selectedItems} onSelectItem={onSelectItem} />
      </div>
    </FashionItemsProvider>
  );
};

export default Footer;
