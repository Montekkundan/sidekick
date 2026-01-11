import { ImageResponse } from 'next/og';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'black',
          color: 'white',
          padding: '80px',
          justifyContent: 'center',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <svg width="80" height="80" viewBox="0 0 256 256">
              <path fill="none" d="M0 0h256v256H0z"/>
              <path fill="none" stroke="#fff" stroke-width="25" stroke-linecap="round" d="M208 128l-80 80M192 40L40 192"/>
            </svg>
            <div
              style={{
                fontSize: '60',
                lineHeight: 1,
              }}
            >
              ×
            </div>
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path fill="#fff" d="M49.542 17.322c-17.766 0-32.22 14.454-32.22 32.22s14.454 32.22 32.22 32.22 32.22-14.454 32.22-32.22-14.454-32.22-32.22-32.22Zm0 48.894c-9.21 0-16.674-7.464-16.674-16.674 0-9.21 7.464-16.674 16.674-16.674 9.21 0 16.674 7.464 16.674 16.674 0 9.21-7.464 16.674-16.674 16.674Z"/>
              <path fill="#fff" fill-rule="evenodd" d="M52.242 12.03V0c26.148 1.398 46.92 23.046 46.92 49.542 0 26.496-20.772 48.138-46.92 49.542v-12.03c19.488-1.392 34.92-17.676 34.92-37.512 0-19.836-15.432-36.12-34.92-37.512ZM21.126 74.142c-5.166-5.964-8.496-13.56-9.09-21.9H0c.624 11.67 5.292 22.26 12.606 30.414l8.514-8.514h.006Zm25.716 24.942v-12.03c-8.346-.594-15.942-3.918-21.906-9.09l-8.514 8.514c8.16 7.32 18.75 11.982 30.414 12.606h.006Z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            shadturbo
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.5,
            }}
          >
            Turborepo starter with shadcn/ui
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}