"""Builds the app's photo assets from the design's textures (design/generated-*.png).

The design files are really 1408 x 768 JPEGs (~1 MB each). Each is resized to cover its
largest on-screen size at 3x and saved as WebP, which is much smaller.

Run from the repo root:  python scripts/assets/make-images.py
"""

from pathlib import Path

from PIL import Image

# source, target, height in px (on-screen height in pt x 3, or more when "cover" crops width)
IMAGES = [
    # Sign in hero: 390 x 240 pt
    ("design/generated-5.png", "assets/images/sign-in-hero.webp", 720),
    # Onboarding guitar cards: about 326 x 120 pt; the wide crop needs ~980 px of width
    ("design/generated-3.png", "assets/images/guitar-acoustic.webp", 540),
    ("design/generated-4.png", "assets/images/guitar-electric.webp", 540),
]

for source, target, height in IMAGES:
    image = Image.open(source).convert("RGB")
    width = round(image.width * height / image.height)
    image = image.resize((width, height), Image.LANCZOS)
    path = Path(target)
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=80, method=6)
    print(f"{path}: {width} x {height}, {path.stat().st_size // 1024} KB")
