import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  onClickOutside?: (() => void) | null;
  onBackspacePress?: (() => void) | null;
  onEscPress?: (() => void) | null;
}

const Panel = React.memo(({ onClickOutside, onBackspacePress, onEscPress, ...props }: PanelProps) => {
  const root = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (event) {
        if (onClickOutside && root.current) {
          const target = event.target as Node;

          if (!root.current.contains(target)) {
            event.preventDefault();
            onClickOutside();
          }
        }
      }
    },
    [onClickOutside],
  );

  useEffect(
    () => {
      if (onClickOutside) {
        document.addEventListener('mousedown', handleClick, false);

        return () => {
          document.removeEventListener('mousedown', handleClick, false);
        };
      }
    },
    [onClickOutside],
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event) {
        if (onBackspacePress && event.key === 'Backspace') {
          event.preventDefault();
          onBackspacePress();
        }

        if (onEscPress && event.key === 'Escape') {
          event.preventDefault();
          onEscPress();
        }
      }
    },
    [onBackspacePress, onEscPress],
  );

  useEffect(
    () => {
      if (onBackspacePress || onEscPress) {
        document.addEventListener('keydown', handleKeyPress, false);

        return () => {
          document.removeEventListener('keydown', handleKeyPress, false);
        };
      }
    },
    [onBackspacePress, onEscPress],
  );

  return <div ref={root} {...props} />;
});

export default styled(Panel)``;
