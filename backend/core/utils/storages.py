from django.conf import settings
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage

# DEBUGに応じて使用するストレージクラスを切り替え
if settings.DEBUG:
    storage_class = FileSystemStorage
else:
    storage_class = S3Boto3Storage


class CustomStorage(storage_class):
    # 同名ファイルが上書きされないように設定
    file_overwrite = False
    counts = {}

    def get_alternative_name(self, file_root, file_ext):
        # 既存の場合はファイル名に _1, _2 ... を付与
        if file_root not in self.counts:
            self.counts[file_root] = 1
        new_file_name = file_root + "_" + str(self.counts[file_root]) + file_ext
        self.counts[file_root] += 1
        return new_file_name
