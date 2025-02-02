from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import CustomUser
from ..serializers.user_serializers import CustomUserDetailsSerializer, UserUpdateSerializer


class UserDetailView(APIView):
    """ユーザーの詳細情報"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserDetailsSerializer(request.user)
        return Response(serializer.data)


class UserUpdateView(generics.UpdateAPIView):
    """ユーザー情報アップデート"""

    queryset = CustomUser.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def _handle_profile_image_update(self, user, new_profile_image):
        """プロフィール画像の更新処理"""
        # 古い画像が存在し、かつ新しい画像で更新された場合に古い画像を削除
        if new_profile_image and user.profile_image:
            old_image = user.profile_image
            # もし新しい画像と異なり、かつファイルが存在しているなら削除
            if old_image != new_profile_image and old_image.storage.exists(old_image.name):
                old_image.storage.delete(old_image.name)

    def perform_update(self, serializer):
        user = self.get_object()

        # プロフィール画像が提供された場合
        profile_image = self.request.data.get("profile_image")
        if profile_image:
            # ユーザーオブジェクトを更新
            self._handle_profile_image_update(user, profile_image)
            serializer.save(profile_image=profile_image)
        else:
            # プロフィール画像が提供されない場合、ユーザーオブジェクトをそのまま保存
            serializer.save()
