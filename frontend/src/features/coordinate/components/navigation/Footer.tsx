'use client';

import { FashionItemsProvider } from '@/context/FashionItemsContext';
import ResetDialog from '../dialog/ResetDialog';
import AddItemsDrawer from '../drawer/AddItemsDrawer';
import SelectBackgroundDrawer from '../drawer/SelectBackgroundDrawer';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';

const Footer = () => {
  const { state } = useCoordinateCanvasState();
  return (
    <FashionItemsProvider>
      <div className="flex items-center justify-around pt-5 pb-2 w-full">
        {state.selectedItems && state.selectedItems?.length > 0 && <ResetDialog />}
        <SelectBackgroundDrawer />
        <AddItemsDrawer />
      </div>
    </FashionItemsProvider>
  );
};

export default Footer;
