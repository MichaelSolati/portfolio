import parse from 'html-react-parser';
import React from 'react';

import {siteConfig} from '@/config/site';

const neon = '#00FFF0';

interface OGImageTemplateProps {
  icon: string;
  title: string;
}

export default function OGImageTemplate({icon, title}: OGImageTemplateProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(circle at center, #23272f, #181A20)',
        color: '#fff',
        border: `8px solid ${neon}`,
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: '"Space Grotesk"',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '48px',
          backgroundColor: '#23272f',
          borderBottom: `2px solid ${neon}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${neon}`,
            borderRadius: '2px',
            marginRight: '6px',
          }}
        ></div>
        <div
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${neon}`,
            borderRadius: '2px',
            marginRight: '6px',
          }}
        ></div>
        <div
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${neon}`,
            borderRadius: '2px',
          }}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          boxShadow: `0 0 70px 25px ${neon}33`,
          marginBottom: '40px',
        }}
      >
        <div style={{display: 'flex'}}>
          {parse(
            icon
              .replace('stroke="currentColor"', `stroke="${neon}"`)
              .replace('width="24"', 'width="128"')
              .replace('height="24"', 'height="128"'),
          )}
        </div>
      </div>

      <div
        style={{
          fontSize: '84px',
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: '90%',
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '40px',
          fontSize: '28px',
          color: neon,
        }}
      >
        {siteConfig.handles.github
          ? `@${siteConfig.handles.github}`
          : siteConfig.name}
      </div>
    </div>
  );
}
