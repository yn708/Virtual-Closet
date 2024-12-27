import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BaseDialogProps {
  trigger: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  headerContent?: React.ReactNode; // Header内に追加で表示したいコンテンツ
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  trigger,
  title,
  description,
  headerContent,
  children,
  className,
  headerClassName,
}) => {
  // Headerセクションがいずれかのコンテンツがある場合のみ表示
  const showHeader = title || description || headerContent;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        {showHeader ? (
          <DialogHeader className={headerClassName}>
            {/* DialogTitleが必須なので、非表示で配置 */}
            <DialogTitle className={!title ? 'sr-only' : undefined}>{title}</DialogTitle>
            {/* DialogDescriptionも必須なので、非表示で配置 */}
            <DialogDescription className={!description ? 'sr-only' : undefined}>
              {description}
            </DialogDescription>
            {/* 追加のヘッダーコンテンツがある場合に表示 */}
            {headerContent}
          </DialogHeader>
        ) : (
          // Headerがない場合はshadcnの要件を満たすための非表示要素
          <div className="sr-only">
            <DialogHeader>
              <DialogTitle />
              <DialogDescription />
            </DialogHeader>
          </div>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default BaseDialog;

// // 使用方法
// <BaseDialog
//   trigger={<IconButton {...buttonProps} />}
//   title="詳細情報"
//   description="詳細情報"
// >
//   {/* content */}
// </BaseDialog>
