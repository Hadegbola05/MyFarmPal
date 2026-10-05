import os
import math
import subprocess

os.makedirs('/tmp/splash_frames', exist_ok=True)

width, height = 800, 600
fps = 24
total_frames = 144  # 6.0 seconds

for i in range(total_frames):
    t = i / fps

    # Stage logic
    if t < 2.0:
        p = t / 2.0
        f_x = 120 + p * 200
        p_x = 680 - p * 200
        bob = math.sin(t * 14) * 6
        arm_reach = 0.0
        leaf_scale = 0.0
        text_alpha = 0.0
        handshake_alpha = 0.0
    elif t < 3.2:
        p = (t - 2.0) / 1.2
        f_x = 320 + p * 45
        p_x = 480 - p * 45
        bob = math.sin(t * 12) * 4
        arm_reach = p
        leaf_scale = 0.0
        text_alpha = 0.0
        handshake_alpha = 0.0
    elif t < 4.2:
        p = (t - 3.2) / 1.0
        f_x = 365 + p * 4
        p_x = 435 - p * 4
        bob = 0
        arm_reach = 1.0
        leaf_scale = 0.0
        text_alpha = 0.0
        handshake_alpha = min(1.0, p * 2.0)
    elif t < 5.0:
        p = (t - 4.2) / 0.8
        f_x = 369
        p_x = 431
        bob = 0
        arm_reach = 1.0
        leaf_scale = min(1.15, p * 1.25)
        text_alpha = p * 0.5
        handshake_alpha = 1.0
    else:
        p = (t - 5.0) / 1.0
        f_x = 369
        p_x = 431
        bob = 0
        arm_reach = 1.0
        leaf_scale = 1.0
        text_alpha = min(1.0, 0.5 + p * 0.5)
        handshake_alpha = 1.0

    f_y = 220 + bob
    p_y = 220 + (bob if t < 3.2 else 0)

    leaf_tag = ""
    if leaf_scale > 0.05:
        leaf_tag = f'<g transform="translate(54, 18) scale({leaf_scale:.2f}) translate(-54, -18)"><path d="M54 22C61 8 72 10 71 20C61 24 57 22 54 22Z" fill="#52B824" stroke="#2B1608" stroke-width="3.5"/></g>'

    handshake_tag = ""
    if handshake_alpha > 0.05:
        handshake_tag = f'<g opacity="{handshake_alpha:.2f}"><path d="M394 240 C398 226 404 224 408 232 C412 224 418 226 422 240" fill="none" stroke="#6F4223" stroke-width="5" stroke-linecap="round"/></g>'

    text_tag = ""
    if text_alpha > 0.05:
        text_tag = f'''<g opacity="{text_alpha:.2f}" transform="translate(400, 420)">
        <text text-anchor="middle" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="900" fill="#2B1608">
          <tspan fill="#1E293B">My</tspan><tspan fill="#4EA923">Farm</tspan><tspan fill="#FAB814">Pal</tspan>
        </text>
        <text text-anchor="middle" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="600" fill="#64748B" letter-spacing="0.5">
          Your Farm Pal. Your Language.
        </text>
      </g>'''

    svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
      
      <line x1="120" y1="360" x2="680" y2="360" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate({f_x - 45:.1f}, {f_y - 45:.1f})">
        {leaf_tag}
        <path d="M36 26C36 17 45 13 54 13C60 13 63 17 63 24C63 36 60 45 60 46H48V58H58V70H48V90C48 97 44 102 39 104C34 102 33 97 33 90V36C33 30 34 27 36 26Z" fill="#54B82A" stroke="#2B1608" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="43" cy="32" r="2.8" fill="#2B1608"/>
        <circle cx="53" cy="32" r="2.8" fill="#2B1608"/>
        <path d="M44 38C46 41 50 41 52 38" stroke="#2B1608" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M33 62L22 56C19 54 15 59 18 62L19 68" stroke="#6F4223" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M58 64 L{64 + arm_reach * 20:.1f} {64 - arm_reach * 4:.1f}" stroke="#6F4223" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M39 102L32 114M39 102L39 116M39 102L46 113" stroke="#2B1608" stroke-width="4" stroke-linecap="round"/>
      </g>

      <g transform="translate({p_x - 45:.1f}, {p_y - 45:.1f})">
        <path d="M65 30C65 21 73 17 84 17C96 17 102 25 102 36C102 46 94 54 83 54H74V90C74 97 70 102 65 104C60 102 60 97 60 90V36C60 32 62 30 65 30Z" fill="#FFBD0A" stroke="#2B1608" stroke-width="4" stroke-linejoin="round"/>
        <path d="M74 30H83C88 30 92 33 92 38C92 43 88 46 83 46H74V30Z" fill="#FFF2B2" stroke="#2B1608" stroke-width="2.5"/>
        <circle cx="77" cy="36" r="2.8" fill="#2B1608"/>
        <circle cx="88" cy="37" r="2.8" fill="#2B1608"/>
        <path d="M79 41C82 44 85 44 87 41" stroke="#2B1608" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M80 47C83 49 86 48 88 47" stroke="#2B1608" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M60 62 L{56 - arm_reach * 20:.1f} {64 - arm_reach * 4:.1f}" stroke="#6F4223" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M96 60L102 66" stroke="#6F4223" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M65 102L58 114M65 102L65 116M65 102L72 113" stroke="#2B1608" stroke-width="4" stroke-linecap="round"/>
      </g>

      {handshake_tag}
      {text_tag}
    </svg>'''

    with open(f'/tmp/splash_frames/frame_{i:03d}.svg', 'w') as f:
        f.write(svg)

print('Generated 144 SVG frames.')
