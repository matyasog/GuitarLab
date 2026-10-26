"""Builds the Sign in hero image from the design's texture.

design/generated-5.png (really a 1408 x 768 JPEG, ~1 MB) is shown at 390 x 240 pt
with "cover". 720 px high covers 3x screens; WebP keeps the file small.

Run from the repo root:  python scripts/assets/make-hero.py
"""

from pathlib import Path

from PIL import Image

SOURCE = Path("design/generated-5.png")
TARGET = Path("assets/images/sign-in-hero.webp")
HEIGHT = 720  # 240 pt x 3

image = Image.open(SOURCE).convert("RGB")
width = round(image.width * HEIGHT / image.height)
image = image.resize((width, HEIGHT), Image.LANCZOS)
TARGET.parent.mkdir(parents=True, exist_ok=True)
image.save(TARGET, "WEBP", quality=80, method=6)
print(f"{TARGET}: {width} x {HEIGHT}, {TARGET.stat().st_size // 1024} KB")
