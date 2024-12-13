import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FashionItemsContents from '@/features/my-page/fashion-item/components/content/FashionItemsContents';
import { BiCloset } from 'react-icons/bi';
import { LuShirt } from 'react-icons/lu';

const MyPageTabs = () => {
  const TAB_ITEMS = [
    {
      value: 'items',
      label: 'アイテム',
      icon: LuShirt,
      content: () => <FashionItemsContents />,
    },
    {
      value: 'coordinate',
      label: 'コーディネート',
      icon: BiCloset,
      content: () => <></>,
    },
  ] as const;

  return (
    <Tabs defaultValue="items" className="w-full m-0">
      <TabsList className="w-full justify-around bg-transparent border-b-2 py-5 rounded-none shadow">
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="gap-2 px-4 py-2.5 text-sm text-gray-500 data-[state=active]:text-gray-900 
              dark:data-[state=active]:text-gray-100 data-[state=active]:border-gray-600 
              dark:data-[state=active]:border-gray-100 data-[state=active]:border-b-4 
              data-[state=active]:shadow-none data-[state=active]:rounded-none"
          >
            <Icon />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_ITEMS.map(({ value, content: Content }) => (
        <TabsContent key={value} value={value} className="m-0">
          <Content />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MyPageTabs;
