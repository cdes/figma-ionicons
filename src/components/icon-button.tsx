import { jsx } from '@emotion/core';
import theme from '../theme';
import { memo, useState } from 'react';
import { html as io } from '../io';

interface IconButtonProps {
  name: string;
  version: string;
  style: object;
}

async function sendIcon(name, url) {
  const response = await fetch(url);
  const icon = await response.text();
  io.send('add-icon', { icon, name });
}

function IconButton({ name, style, version }: IconButtonProps) {
  const [status, setStatus] = useState('is-loading');
  const url = `https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/svg/${name}.svg`;

  return (
    <button
      key={name}
      aria-label={name}
      onClick={() => sendIcon(name, url)}
      css={{
        padding: theme.space[2],
        color: '#333',
        background: 'transparent',
        border: 0,
        borderRadius: theme.radii[1],
        appearance: 'none',
        fontSize: '24px',
        outline: 0,
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.06)',
        },
        '&:focus, &:active': {
          boxShadow: `inset 0 0 0 2px ${theme.colors.blue}`,
        },
        ...style,
      }}
      className={status}
    >
      <img
        src={url}
        width={24}
        height={24}
        onLoad={() => setStatus('is-loaded')}
        onError={() => setStatus('is-error')}
      />
    </button>
  );
}

export default memo(IconButton);
