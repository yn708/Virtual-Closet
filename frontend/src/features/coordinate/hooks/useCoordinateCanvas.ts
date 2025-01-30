'use client';

import { MOVEMENT_THRESHOLD, SNAP_ANGLES, SNAP_THRESHOLD } from '@/utils/constants';
import { useCallback, useRef, useState } from 'react';
import type { DragStart, ItemStyle, TransformStart } from '../types';

/**
 * コーディネートキャンバスのメインロジックを管理するカスタムフック
 * アイテムの選択、ドラッグ、拡大縮小、回転などの操作を制御
 */
export const useCoordinateCanvas = (
  itemStyles: Record<string, ItemStyle>,
  onUpdateStyles: (styles: Record<string, ItemStyle>) => void,
) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // 選択中のアイテムID
  const [isDragging, setIsDragging] = useState(false); // ドラッグ操作中かどうか

  const dragStartRef = useRef<DragStart | null>(null); // ドラッグ開始時の情報
  const transformStartRef = useRef<TransformStart | null>(null); // 変形開始時の情報

  //   回転角度を最も近いスナップ角度に調整する
  const snapToNearestAngle = useCallback((angle: number): number => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    for (const snapAngle of SNAP_ANGLES) {
      if (Math.abs(normalizedAngle - snapAngle) <= SNAP_THRESHOLD) {
        return snapAngle;
      }
    }
    return normalizedAngle;
  }, []);

  //   アイテムの位置をキャンバス内に制限する
  const constrainPosition = useCallback((xPercent: number, yPercent: number): [number, number] => {
    const margin = 5; // キャンバス端からのマージン（%）
    return [
      Math.max(margin, Math.min(100 - margin, xPercent)),
      Math.max(margin, Math.min(100 - margin, yPercent)),
    ];
  }, []);

  //   アイテムのz-indexを更新し、選択したアイテムを最前面に表示する
  const updateZIndex = useCallback(
    (itemId: string) => {
      // 現在表示されている全てのアイテムのz-indexを取得
      const els = document.querySelectorAll('.draggable-element');
      let maxZIndex = -Infinity;

      els.forEach((el) => {
        const zIndex = parseInt(window.getComputedStyle(el).getPropertyValue('z-index'));
        if (!isNaN(zIndex) && zIndex > maxZIndex) {
          maxZIndex = zIndex;
        }
      });

      const currentStyle = itemStyles[itemId];
      if (!currentStyle) return;

      // 最大のz-index + 1 を設定して最前面に表示
      onUpdateStyles({
        ...itemStyles,
        [itemId]: {
          ...currentStyle,
          zIndex: maxZIndex + 1,
        },
      });
    },
    [itemStyles, onUpdateStyles],
  );

  //   アイテムのドラッグ開始時の処理
  const handleDragStart = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      itemId: string,
      containerRef: React.RefObject<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();
      if ('button' in e && e.button !== 0) return; // 左クリックのみ許可

      const element = e.currentTarget as HTMLElement;
      if (!element || !containerRef.current) return;

      updateZIndex(itemId); // アイテムを最前面に表示
      setIsDragging(true); // ドラッグ開始フラグを設定

      // タッチとマウスの両方に対応
      const point = 'touches' in e ? e.touches[0] : e;
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentStyle = itemStyles[itemId];
      if (!currentStyle) return;

      // ドラッグ開始時の情報を保存
      dragStartRef.current = {
        mouseX: point.clientX,
        mouseY: point.clientY,
        startXPercent: currentStyle.xPercent,
        startYPercent: currentStyle.yPercent,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      };

      //   ドラッグ中の移動処理
      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        moveEvent.preventDefault();
        const dragStart = dragStartRef.current;
        if (!dragStart || !containerRef.current) return;

        const movePoint = 'touches' in moveEvent ? moveEvent.touches[0] : moveEvent;

        // マウスの移動量をパーセンテージに変換
        const dx = ((movePoint.clientX - dragStart.mouseX) / dragStart.containerWidth) * 100;
        const dy = ((movePoint.clientY - dragStart.mouseY) / dragStart.containerHeight) * 100;

        // 新しい位置を計算し、キャンバス内に制限
        const [constrainedXPercent, constrainedYPercent] = constrainPosition(
          dragStart.startXPercent + dx,
          dragStart.startYPercent + dy,
        );

        // スタイルを更新
        onUpdateStyles({
          ...itemStyles,
          [itemId]: {
            ...currentStyle,
            xPercent: constrainedXPercent,
            yPercent: constrainedYPercent,
          },
        });
      };

      //   ドラッグ終了時の処理
      const handleEnd = () => {
        setIsDragging(false);
        dragStartRef.current = null;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };

      // イベントリスナーの設定
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    },
    [itemStyles, onUpdateStyles, constrainPosition, updateZIndex],
  );

  //   アイテムの変形（拡大縮小・回転）開始時の処理
  const handleTransformStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
      e.stopPropagation();
      e.preventDefault();

      const itemElement = (e.currentTarget as HTMLElement).closest(
        '.draggable-element',
      ) as HTMLElement;
      if (!itemElement) return;

      // タッチとマウスの両方に対応
      const point = 'touches' in e ? e.touches[0] : e;
      const itemRect = itemElement.getBoundingClientRect();
      const centerX = itemRect.left + itemRect.width / 2; // 回転の中心X座標
      const centerY = itemRect.top + itemRect.height / 2; // 回転の中心Y座標

      const currentStyle = itemStyles[itemId];
      if (!currentStyle) return;

      let isRotating = false; // 回転モードのフラグ

      const startMouseX = point.clientX;
      const startMouseY = point.clientY;
      const startRotate = currentStyle.rotate || 0; // 開始時の回転角度
      const startScale = currentStyle.scale || 1; // 開始時の拡大率

      // 変形開始時の情報を保存
      transformStartRef.current = {
        mouseX: startMouseX,
        mouseY: startMouseY,
        centerX,
        centerY,
        startRotate,
        startScale,
        distance: Math.sqrt(
          Math.pow(startMouseX - centerX, 2) + Math.pow(startMouseY - centerY, 2),
        ),
        angle: Math.atan2(startMouseY - centerY, startMouseX - centerX),
      };

      // 現在の角度がスナップ角度に近いかチェック
      const isStraight = SNAP_ANGLES.some(
        (angle) => Math.abs((currentStyle.rotate % 360) - angle) <= SNAP_THRESHOLD,
      );

      //   変形中の処理
      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        moveEvent.preventDefault();
        const transformStart = transformStartRef.current;
        if (!transformStart) return;

        const movePoint = 'touches' in moveEvent ? moveEvent.touches[0] : moveEvent;

        // 現在のマウス位置と中心点との距離を計算
        const currentDistance = Math.sqrt(
          Math.pow(movePoint.clientX - transformStart.centerX, 2) +
            Math.pow(movePoint.clientY - transformStart.centerY, 2),
        );

        // 現在のマウス位置と中心点との角度を計算
        const currentAngle = Math.atan2(
          movePoint.clientY - transformStart.centerY,
          movePoint.clientX - transformStart.centerX,
        );

        // マウスの移動距離を計算
        const mouseMoveX = movePoint.clientX - transformStart.mouseX;
        const mouseMoveY = movePoint.clientY - transformStart.mouseY;
        const moveDistance = Math.sqrt(mouseMoveX * mouseMoveX + mouseMoveY * mouseMoveY);

        // 回転モードの判定
        if (!isRotating && moveDistance > MOVEMENT_THRESHOLD) {
          isRotating = true;
        }

        // スケールの計算
        const scaleDelta = currentDistance / transformStart.distance;
        const newScale = Math.max(0.5, Math.min(2, transformStart.startScale * scaleDelta));

        // 回転角度の計算
        let newRotate = currentStyle.rotate;
        if ((!isStraight || isRotating) && moveDistance > MOVEMENT_THRESHOLD) {
          const angleDelta = ((currentAngle - transformStart.angle) * 180) / Math.PI;
          newRotate = snapToNearestAngle(transformStart.startRotate + angleDelta);
        }

        // スタイルを更新
        onUpdateStyles({
          ...itemStyles,
          [itemId]: {
            ...currentStyle,
            scale: newScale,
            rotate: newRotate,
          },
        });
      };

      //   変形終了時の処理
      const handleEnd = () => {
        transformStartRef.current = null;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };

      // イベントリスナーの設定
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    },
    [itemStyles, onUpdateStyles, snapToNearestAngle],
  );

  return {
    selectedItemId,
    isDragging,
    handlers: {
      setSelectedItemId,
      handleDragStart,
      handleTransformStart,
      updateZIndex,
    },
  };
};
