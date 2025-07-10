#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

def create_favicon():
    # Create a 32x32 image with blue background
    img = Image.new('RGBA', (32, 32), (30, 64, 175, 255))  # Blue background
    draw = ImageDraw.Draw(img)
    
    # Add white border
    draw.rectangle([0, 0, 31, 31], outline=(255, 255, 255, 255), width=1)
    
    # Try to use a font, fallback to default if not available
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 18)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
        except:
            font = ImageFont.load_default()
    
    # Draw dollar sign
    text = "$"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (32 - text_width) // 2
    y = (32 - text_height) // 2
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Add decorative dots
    dots = [(8, 8), (24, 8), (8, 24), (24, 24)]
    for dot_x, dot_y in dots:
        draw.ellipse([dot_x-1.5, dot_y-1.5, dot_x+1.5, dot_y+1.5], fill=(59, 130, 246, 179))
    
    # Save as PNG first
    img.save('favicon.png')
    
    # Convert to ICO format
    sizes = [(16, 16), (32, 32), (48, 48)]
    images = [img.resize(size, Image.Resampling.LANCZOS) for size in sizes]
    images[0].save('favicon.ico', format='ICO', sizes=[(size[0], size[1]) for size in sizes])
    print("Favicon created successfully! Files: favicon.png, favicon.ico")

if __name__ == "__main__":
    create_favicon() 