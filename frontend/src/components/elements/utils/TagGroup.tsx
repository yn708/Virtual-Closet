export interface TagGroupProps {
  items: Array<{ id: string; [key: string]: string }>;
  valueKey: string;
}

const TagGroup = ({ items, valueKey }: TagGroupProps) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <span
        key={item.id}
        className="rounded-md border px-3 py-1 font-medium bg-white/50 dark:bg-gray-800/50"
      >
        {item[valueKey]}
      </span>
    ))}
  </div>
);
export default TagGroup;
