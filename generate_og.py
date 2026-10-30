import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

WIDTH = 1200
HEIGHT = 630

# Colors
GOLD_LIGHT = (255, 245, 225)
GOLD_MAIN = (235, 198, 118)
GOLD_DEEP = (195, 150, 60)
GOLD_BORDER = (212, 175, 55, 160)
GOLD_SOFT = (230, 205, 150, 220)
TEXT_MUTED = (220, 195, 160, 210)

def create_og_image():
    # 1. Base canvas with radial gradient
    base = Image.new("RGBA", (WIDTH, HEIGHT), (28, 4, 7, 255))
    draw_base = ImageDraw.Draw(base)

    cx, cy = WIDTH // 2, int(HEIGHT * 0.42)
    max_radius = int(math.hypot(WIDTH / 2, HEIGHT / 2))

    # Radial gradient from warm burgundy/vermilion to dark wine
    for r in range(max_radius, 0, -6):
        t = r / max_radius
        # Interpolate between center (85, 22, 28) and edge (28, 4, 7)
        cr = int(85 * (1 - t) + 28 * t)
        cg = int(22 * (1 - t) + 4 * t)
        cb = int(28 * (1 - t) + 7 * t)
        draw_base.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb, 255))

    # 2. Blend palace courtyard background texture if available
    palace_path = os.path.join("public", "palace-courtyard.jpg")
    if os.path.exists(palace_path):
        palace = Image.open(palace_path).convert("RGBA")
        palace = palace.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
        # Soften and darken
        palace = ImageEnhance.Color(palace).enhance(0.4)
        palace = ImageEnhance.Brightness(palace).enhance(0.35)
        # Apply gentle blur
        palace = palace.filter(ImageFilter.GaussianBlur(radius=3))
        # Mask with soft center transparency
        mask = Image.new("L", (WIDTH, HEIGHT), 45) # 45/255 opacity
        base = Image.composite(palace, base, mask)

    # Re-draw object on top of base
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # 3. Double Gold Borders
    # Outer frame
    pad_out = 24
    draw.rectangle(
        [pad_out, pad_out, WIDTH - pad_out, HEIGHT - pad_out],
        outline=(212, 175, 55, 110),
        width=1
    )
    # Inner frame
    pad_in = 34
    draw.rectangle(
        [pad_in, pad_in, WIDTH - pad_in, HEIGHT - pad_in],
        outline=(230, 198, 115, 180),
        width=2
    )

    # Corner decorative brackets
    bracket_len = 36
    for (x0, y0, dx, dy) in [
        (pad_in + 4, pad_in + 4, 1, 1),
        (WIDTH - pad_in - 4, pad_in + 4, -1, 1),
        (pad_in + 4, HEIGHT - pad_in - 4, 1, -1),
        (WIDTH - pad_in - 4, HEIGHT - pad_in - 4, -1, -1),
    ]:
        draw.line([x0, y0, x0 + dx * bracket_len, y0], fill=GOLD_MAIN, width=2)
        draw.line([x0, y0, x0, y0 + dy * bracket_len], fill=GOLD_MAIN, width=2)
        draw.ellipse([x0 - 2, y0 - 2, x0 + 2, y0 + 2], fill=GOLD_LIGHT)

    # 4. Central Monogram Emblem Logo (A & H)
    emblem_y = 112
    emblem_r = 54

    # Monogram outer dashed circle
    for angle in range(0, 360, 10):
        rad = math.radians(angle)
        rad_end = math.radians(angle + 5)
        x1 = cx + (emblem_r + 6) * math.cos(rad)
        y1 = emblem_y + (emblem_r + 6) * math.sin(rad)
        x2 = cx + (emblem_r + 6) * math.cos(rad_end)
        y2 = emblem_y + (emblem_r + 6) * math.sin(rad_end)
        draw.line([x1, y1, x2, y2], fill=(212, 175, 55, 130), width=1)

    # Monogram solid gold circles
    draw.ellipse(
        [cx - emblem_r, emblem_y - emblem_r, cx + emblem_r, emblem_y + emblem_r],
        outline=GOLD_MAIN,
        width=2
    )
    draw.ellipse(
        [cx - (emblem_r - 5), emblem_y - (emblem_r - 5), cx + (emblem_r - 5), emblem_y + (emblem_r - 5)],
        outline=(212, 175, 55, 120),
        width=1
    )

    # Cardinal gold diamonds
    for dx, dy in [(0, -emblem_r - 6), (0, emblem_r + 6), (-emblem_r - 6, 0), (emblem_r + 6, 0)]:
        px, py = cx + dx, emblem_y + dy
        draw.polygon([(px, py - 3), (px + 3, py), (px, py + 3), (px - 3, py)], fill=GOLD_LIGHT)

    # Lotus Crown top motif
    crown_y = emblem_y - emblem_r + 4
    draw.polygon([(cx, crown_y - 14), (cx + 5, crown_y - 2), (cx, crown_y + 4), (cx - 5, crown_y - 2)], fill=GOLD_MAIN)
    draw.polygon([(cx - 7, crown_y - 6), (cx - 1, crown_y), (cx - 10, crown_y + 4)], fill=GOLD_MAIN)
    draw.polygon([(cx + 7, crown_y - 6), (cx + 1, crown_y), (cx + 10, crown_y + 4)], fill=GOLD_MAIN)

    # Monogram Fonts
    font_mono_main = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 46)
    font_mono_amp = ImageFont.truetype(r"C:\Windows\Fonts\georgiai.ttf", 26)

    # Letter 'A' (Astha)
    draw.text((cx - 22, emblem_y + 2), "A", font=font_mono_main, fill=GOLD_LIGHT, anchor="mm")
    # Ampersand '&'
    draw.text((cx + 1, emblem_y - 2), "&", font=font_mono_amp, fill=GOLD_MAIN, anchor="mm")
    # Letter 'H' (Harshad)
    draw.text((cx + 24, emblem_y + 2), "H", font=font_mono_main, fill=GOLD_LIGHT, anchor="mm")

    # Bottom flourish under monogram
    fl_y = emblem_y + emblem_r - 10
    draw.line([cx - 24, fl_y, cx + 24, fl_y], fill=GOLD_MAIN, width=1)
    draw.ellipse([cx - 2, fl_y - 2, cx + 2, fl_y + 2], fill=GOLD_LIGHT)

    # 5. Typography
    font_eyebrow = ImageFont.truetype(r"C:\Windows\Fonts\pala.ttf", 15)
    font_names = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 68)
    font_amp = ImageFont.truetype(r"C:\Windows\Fonts\georgiai.ttf", 54)
    font_details = ImageFont.truetype(r"C:\Windows\Fonts\pala.ttf", 22)
    font_venue = ImageFont.truetype(r"C:\Windows\Fonts\georgiai.ttf", 28)
    font_hash = ImageFont.truetype(r"C:\Windows\Fonts\pala.ttf", 13)

    # Eyebrow
    eyebrow_text = "T O G E T H E R   W I T H   T H E I R   F A M I L I E S"
    draw.text((cx, 206), eyebrow_text, font=font_eyebrow, fill=GOLD_SOFT, anchor="mm")

    # Names: Astha & Harshad
    # Draw drop shadow for names
    names_y = 282
    draw.text((cx - 150, names_y + 2), "Astha", font=font_names, fill=(15, 2, 4, 180), anchor="mm")
    draw.text((cx, names_y - 2 + 2), "&", font=font_amp, fill=(15, 2, 4, 180), anchor="mm")
    draw.text((cx + 170, names_y + 2), "Harshad", font=font_names, fill=(15, 2, 4, 180), anchor="mm")

    # Draw foreground names
    draw.text((cx - 150, names_y), "Astha", font=font_names, fill=GOLD_LIGHT, anchor="mm")
    draw.text((cx, names_y - 2), "&", font=font_amp, fill=GOLD_MAIN, anchor="mm")
    draw.text((cx + 170, names_y), "Harshad", font=font_names, fill=GOLD_LIGHT, anchor="mm")

    # Divider line with diamond ✦
    div_y = 354
    line_w = 210
    draw.line([cx - line_w, div_y, cx - 20, div_y], fill=(212, 175, 55, 180), width=1)
    draw.line([cx + 20, div_y, cx + line_w, div_y], fill=(212, 175, 55, 180), width=1)
    # Diamond
    draw.polygon([(cx, div_y - 4), (cx + 4, div_y), (cx, div_y + 4), (cx - 4, div_y)], fill=GOLD_LIGHT)

    # Date and Time
    date_text = "12  ·  DECEMBER  ·  2026   |   7:00 PM ONWARDS"
    draw.text((cx, 404), date_text, font=font_details, fill=GOLD_LIGHT, anchor="mm")

    # Venue
    venue_text = "Hotel Dev Arjun Singh"
    draw.text((cx, 458), venue_text, font=font_venue, fill=GOLD_MAIN, anchor="mm")

    # Parents Blessing Line
    font_parents = ImageFont.truetype(r"C:\Windows\Fonts\pala.ttf", 14)
    parents_text = "D/o Rajesh & Sudha Gupta  ✦  S/o Sureshbhai & Bhanuben"
    draw.text((cx, 510), parents_text, font=font_parents, fill=TEXT_MUTED, anchor="mm")

    # Hashtag & branding
    draw.text((cx, 560), "#ASTHAWEDSHARSHAD   ·   INVITESTORY.IN", font=font_hash, fill=(212, 175, 55, 150), anchor="mm")

    # Composite layers
    final_img = Image.alpha_composite(base, overlay)
    final_rgb = final_img.convert("RGB")

    # Save lossless compressed PNG (optimize=True, compress_level=9)
    og_png_path = os.path.join("public", "og-image.png")
    final_rgb.save(og_png_path, format="PNG", optimize=True, compress_level=9)

    # Save IG square lossless image (1080x1080) for Instagram preview / sharing
    ig_size = 1080
    ig_img = Image.new("RGB", (ig_size, ig_size), (28, 4, 7))
    # Paste resized centered canvas
    scale = ig_size / WIDTH
    new_h = int(HEIGHT * scale)
    scaled_content = final_rgb.resize((ig_size, new_h), Image.Resampling.LANCZOS)
    ig_img.paste(scaled_content, (0, (ig_size - new_h) // 2))
    ig_png_path = os.path.join("public", "ig-image.png")
    ig_img.save(ig_png_path, format="PNG", optimize=True, compress_level=9)

    # Also save public/og-image.jpg at 95% quality for platforms that prefer JPG
    og_jpg_path = os.path.join("public", "og-image.jpg")
    final_rgb.save(og_jpg_path, format="JPEG", quality=95, optimize=True)

    print(f"Generated OG Image: {og_png_path} ({os.path.getsize(og_png_path)} bytes)")
    print(f"Generated IG Image: {ig_png_path} ({os.path.getsize(ig_png_path)} bytes)")
    print(f"Generated OG JPG: {og_jpg_path} ({os.path.getsize(og_jpg_path)} bytes)")

if __name__ == "__main__":
    create_og_image()
