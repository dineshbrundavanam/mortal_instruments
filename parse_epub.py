#!/usr/bin/env python3
"""
Parse the Mortal Instruments EPUB into structured JSON + chapter HTML files
for the interactive reading web app.
"""

import zipfile
import os
import json
import re
import shutil
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

# ─── Config ───────────────────────────────────────────────────────────────────
EPUB_FILE = [f for f in os.listdir('.') if f.endswith('.epub')][0]
OUTPUT_DIR = 'public/data'
CHAPTERS_DIR = os.path.join(OUTPUT_DIR, 'chapters')
IMAGES_DIR = 'public/images/epub'

# ─── Book Definitions (from TOC analysis) ─────────────────────────────────────
BOOKS = [
    {
        "id": "city-of-bones",
        "title": "City of Bones",
        "bookNumber": 1,
        "year": "2007",
        "tagline": "Every legend has a beginning.",
        "color": "#c9a84c",
        "chapters": [
            {"file": "text/part0010.html", "title": "Pandemonium", "number": 1, "part": "Part One: Dark Descent"},
            {"file": "text/part0011.html", "title": "Secrets and Lies", "number": 2, "part": "Part One: Dark Descent"},
            {"file": "text/part0012.html", "title": "Shadowhunter", "number": 3, "part": "Part One: Dark Descent"},
            {"file": "text/part0013.html", "title": "Ravener", "number": 4, "part": "Part One: Dark Descent"},
            {"file": "text/part0014.html", "title": "Clave and Covenant", "number": 5, "part": "Part One: Dark Descent"},
            {"file": "text/part0015.html", "title": "Forsaken", "number": 6, "part": "Part One: Dark Descent"},
            {"file": "text/part0016.html", "title": "The Five-Dimensional Door", "number": 7, "part": "Part One: Dark Descent"},
            {"file": "text/part0017.html", "title": "Weapon of Choice", "number": 8, "part": "Part One: Dark Descent"},
            {"file": "text/part0018.html", "title": "The Circle and the Brotherhood", "number": 9, "part": "Part One: Dark Descent"},
            {"file": "text/part0020.html", "title": "City of Bones", "number": 10, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0021.html", "title": "Magnus Bane", "number": 11, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0022.html", "title": "Dead Man's Party", "number": 12, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0023.html", "title": "The Memory of Whiteness", "number": 13, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0024.html", "title": "The Hotel Dumort", "number": 14, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0025.html", "title": "High and Dry", "number": 15, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0026.html", "title": "Falling Angels", "number": 16, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0027.html", "title": "The Midnight Flower", "number": 17, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0028.html", "title": "The Mortal Cup", "number": 18, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0029.html", "title": "Abbadon", "number": 19, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0030.html", "title": "In Rats' Alley", "number": 20, "part": "Part Two: Easy is the Descent"},
            {"file": "text/part0032.html", "title": "The Werewolf's Tale", "number": 21, "part": "Part Three: The Descent Beckons"},
            {"file": "text/part0033.html", "title": "Renwick's Ruin", "number": 22, "part": "Part Three: The Descent Beckons"},
            {"file": "text/part0034.html", "title": "Valentine", "number": 23, "part": "Part Three: The Descent Beckons"},
            {"file": "text/part0035.html", "title": "The Ascent Beckons", "number": 0, "part": "Epilogue"},
        ],
        "coverImage": "images/00006.jpeg",
        "mapImage": "images/00008.jpeg",
    },
    {
        "id": "city-of-ashes",
        "title": "City of Ashes",
        "bookNumber": 2,
        "year": "2008",
        "tagline": "Is love worth betraying everything?",
        "color": "#e85d3a",
        "chapters": [
            {"file": "text/part0047.html", "title": "Smoke and Diamonds", "number": 0, "part": "Prologue"},
            {"file": "text/part0049.html", "title": "Valentine's Arrow", "number": 1, "part": "Part One: A Season in Hell"},
            {"file": "text/part0050.html", "title": "The Hunter's Moon", "number": 2, "part": "Part One: A Season in Hell"},
            {"file": "text/part0051.html", "title": "The Inquisitor", "number": 3, "part": "Part One: A Season in Hell"},
            {"file": "text/part0052.html", "title": "The Cuckoo in the Nest", "number": 4, "part": "Part One: A Season in Hell"},
            {"file": "text/part0053.html", "title": "Sins of the Fathers", "number": 5, "part": "Part One: A Season in Hell"},
            {"file": "text/part0054.html", "title": "City of Ashes", "number": 6, "part": "Part One: A Season in Hell"},
            {"file": "text/part0055.html", "title": "The Mortal Sword", "number": 7, "part": "Part One: A Season in Hell"},
            {"file": "text/part0057.html", "title": "The Seelie Court", "number": 8, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0058.html", "title": "And Death Shall Have No Dominion", "number": 9, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0059.html", "title": "A Fine and Private Place", "number": 10, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0060.html", "title": "Smoke and Steel", "number": 11, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0061.html", "title": "The Hostility of Dreams", "number": 12, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0062.html", "title": "A Host of Rebel Angels", "number": 13, "part": "Part Two: The Gates of Hell"},
            {"file": "text/part0064.html", "title": "Fearless", "number": 14, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0065.html", "title": "The Serpent's Tooth", "number": 15, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0066.html", "title": "A Stone of the Heart", "number": 16, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0067.html", "title": "East of Eden", "number": 17, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0068.html", "title": "Darkness Visible", "number": 18, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0069.html", "title": "Dies Irae", "number": 19, "part": "Part Three: Day of Wrath"},
            {"file": "text/part0070.html", "title": "A Door into the Dark", "number": 0, "part": "Epilogue"},
        ],
        "coverImage": "images/00020.jpeg",
        "mapImage": "images/00022.jpeg",
    },
    {
        "id": "city-of-glass",
        "title": "City of Glass",
        "bookNumber": 3,
        "year": "2009",
        "tagline": "Love is a mortal sin and the secrets of the past prove deadly.",
        "color": "#4a90d9",
        "chapters": [
            {"file": "text/part0080.html", "title": "The Portal", "number": 1, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0081.html", "title": "The Demon Towers of Alicante", "number": 2, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0082.html", "title": "Amatis", "number": 3, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0083.html", "title": "Daylighter", "number": 4, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0084.html", "title": "A Problem of Memory", "number": 5, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0085.html", "title": "Bad Blood", "number": 6, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0086.html", "title": "Where Angels Fear to Tread", "number": 7, "part": "Part One: Sparks Fly Upward"},
            {"file": "text/part0088.html", "title": "One of the Living", "number": 8, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0089.html", "title": "This Guilty Blood", "number": 9, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0090.html", "title": "Fire and Sword", "number": 10, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0091.html", "title": "All the Host of Hell", "number": 11, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0092.html", "title": "De Profundis", "number": 12, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0093.html", "title": "Where There Is Sorrow", "number": 13, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0094.html", "title": "In the Dark Forest", "number": 14, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0095.html", "title": "Things Fall Apart", "number": 15, "part": "Part Two: Stars Shine Darkly"},
            {"file": "text/part0099.html", "title": "Articles of Faith", "number": 16, "part": "Part Three: The Way to Heaven"},
            {"file": "text/part0100.html", "title": "The Shadowhunter's Tale", "number": 17, "part": "Part Three: The Way to Heaven"},
            {"file": "text/part0101.html", "title": "Hail and Farewell", "number": 18, "part": "Part Three: The Way to Heaven"},
            {"file": "text/part0102.html", "title": "Peniel", "number": 19, "part": "Part Three: The Way to Heaven"},
            {"file": "text/part0103.html", "title": "Weighed in the Balance", "number": 20, "part": "Part Three: The Way to Heaven"},
            {"file": "text/part0104_split_000.html", "title": "Across the Sky in Stars", "number": 0, "part": "Epilogue", "extra_files": ["text/part0104_split_001.html"]},
        ],
        "coverImage": "images/00037.jpeg",
        "mapImage": "images/00039.jpeg",
    },
    {
        "id": "city-of-fallen-angels",
        "title": "City of Fallen Angels",
        "bookNumber": 4,
        "year": "2011",
        "tagline": "Love. Blood. Betrayal. Revenge.",
        "color": "#9b59b6",
        "chapters": [
            {"file": "text/part0114.html", "title": "The Master", "number": 1, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0115.html", "title": "Falling", "number": 2, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0116.html", "title": "Sevenfold", "number": 3, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0117.html", "title": "The Art of Eight Limbs", "number": 4, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0118.html", "title": "Hell Calls Hell", "number": 5, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0119.html", "title": "Wake The Dead", "number": 6, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0120.html", "title": "Praetor Lupus", "number": 7, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0121.html", "title": "Walk in Darkness", "number": 8, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0122.html", "title": "From Fire Unto Fire", "number": 9, "part": "Part One: Exterminating Angels"},
            {"file": "text/part0124.html", "title": "232 Riverside Drive", "number": 10, "part": "Part Two: For Every Life"},
            {"file": "text/part0125.html", "title": "Our Kind", "number": 11, "part": "Part Two: For Every Life"},
            {"file": "text/part0126.html", "title": "Sanctuary", "number": 12, "part": "Part Two: For Every Life"},
            {"file": "text/part0127.html", "title": "Girl Found Dead", "number": 13, "part": "Part Two: For Every Life"},
            {"file": "text/part0128.html", "title": "What Dreams May Come", "number": 14, "part": "Part Two: For Every Life"},
            {"file": "text/part0129.html", "title": "Beati Bellicosi", "number": 15, "part": "Part Two: For Every Life"},
            {"file": "text/part0130.html", "title": "New York City Angels", "number": 16, "part": "Part Two: For Every Life"},
            {"file": "text/part0131.html", "title": "And Cain Rose Up", "number": 17, "part": "Part Two: For Every Life"},
            {"file": "text/part0132.html", "title": "Scars of Fire", "number": 18, "part": "Part Two: For Every Life"},
            {"file": "text/part0133.html", "title": "Hell is Satisfied", "number": 19, "part": "Part Two: For Every Life"},
        ],
        "coverImage": "images/00051.jpeg",
        "mapImage": "images/00053.jpeg",
    },
    {
        "id": "city-of-lost-souls",
        "title": "City of Lost Souls",
        "bookNumber": 5,
        "year": "2012",
        "tagline": "What price is too high to pay, even for love?",
        "color": "#27ae60",
        "chapters": [
            {"file": "text/part0142.html", "title": "Prologue", "number": 0, "part": "Prologue"},
            {"file": "text/part0144.html", "title": "The Last Council", "number": 1, "part": "Part One: No Evil Angel"},
            {"file": "text/part0145.html", "title": "Thorns", "number": 2, "part": "Part One: No Evil Angel"},
            {"file": "text/part0146.html", "title": "Bad Angels", "number": 3, "part": "Part One: No Evil Angel"},
            {"file": "text/part0147.html", "title": "And Immortality", "number": 4, "part": "Part One: No Evil Angel"},
            {"file": "text/part0148.html", "title": "Valentine's Son", "number": 5, "part": "Part One: No Evil Angel"},
            {"file": "text/part0149.html", "title": "No Weapon in this World", "number": 6, "part": "Part One: No Evil Angel"},
            {"file": "text/part0150.html", "title": "A Sea Change", "number": 7, "part": "Part One: No Evil Angel"},
            {"file": "text/part0152.html", "title": "Fire Tests Gold", "number": 8, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0153.html", "title": "The Iron Sisters", "number": 9, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0154.html", "title": "The Wild Hunt", "number": 10, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0155.html", "title": "Ascribe All Sin", "number": 11, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0156.html", "title": "The Stuff of Heaven", "number": 12, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0157.html", "title": "The Bone Chandelier", "number": 13, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0158.html", "title": "As Ashes", "number": 14, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0159.html", "title": "Magdalena", "number": 15, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0160.html", "title": "Brothers and Sisters", "number": 16, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0161.html", "title": "Valediction", "number": 17, "part": "Part Two: Certain Dark Things"},
            {"file": "text/part0163.html", "title": "Raziel", "number": 18, "part": "Part Three: All Is Changed"},
            {"file": "text/part0164.html", "title": "Love and Blood", "number": 19, "part": "Part Three: All Is Changed"},
            {"file": "text/part0165.html", "title": "A Door into the Dark", "number": 20, "part": "Part Three: All Is Changed"},
            {"file": "text/part0166.html", "title": "Raising Hell", "number": 21, "part": "Part Three: All Is Changed"},
            {"file": "text/part0167.html", "title": "Epilogue", "number": 0, "part": "Epilogue"},
        ],
        "coverImage": "images/00059.jpeg",
        "mapImage": "images/00061.jpeg",
    },
    {
        "id": "city-of-heavenly-fire",
        "title": "City of Heavenly Fire",
        "bookNumber": 6,
        "year": "2014",
        "tagline": "Darkness has descended on the Shadowhunter world.",
        "color": "#e74c3c",
        "chapters": [
            {"file": "text/part0180.html", "title": "Fall like Rain", "number": 0, "part": "Prologue"},
            {"file": "text/part0182.html", "title": "The Portion of Their Cup", "number": 1, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0183.html", "title": "Stand or Fall", "number": 2, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0184.html", "title": "Birds to the Mountain", "number": 3, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0185.html", "title": "Darker than Gold", "number": 4, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0186.html", "title": "Measure of Revenge", "number": 5, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0187.html", "title": "Brother Lead and Sister Steel", "number": 6, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0188.html", "title": "Clash by Night", "number": 7, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0189.html", "title": "Strength in What Remains", "number": 8, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0190.html", "title": "The Arms You Bear", "number": 9, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0191.html", "title": "These Violent Delights", "number": 10, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0192.html", "title": "The Best Is Lost", "number": 11, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0193.html", "title": "The Formal Nightmare", "number": 12, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0194.html", "title": "Paved with Good Intentions", "number": 13, "part": "Part One: Bring Forth a Fire"},
            {"file": "text/part0196.html", "title": "The Sleep of Reason", "number": 14, "part": "Part Two: That World Inverted"},
            {"file": "text/part0197.html", "title": "Brimstone and Salt", "number": 15, "part": "Part Two: That World Inverted"},
            {"file": "text/part0198.html", "title": "The Terrors of the Earth", "number": 16, "part": "Part Two: That World Inverted"},
            {"file": "text/part0199.html", "title": "Burnt Offerings", "number": 17, "part": "Part Two: That World Inverted"},
            {"file": "text/part0200.html", "title": "By the Waters of Babylon", "number": 18, "part": "Part Two: That World Inverted"},
            {"file": "text/part0201.html", "title": "Into the Silent Land", "number": 19, "part": "Part Two: That World Inverted"},
            {"file": "text/part0202.html", "title": "The Serpents of the Dust", "number": 20, "part": "Part Two: That World Inverted"},
            {"file": "text/part0203.html", "title": "The Keys of Death and Hell", "number": 21, "part": "Part Two: That World Inverted"},
            {"file": "text/part0204.html", "title": "The Ashes of Our Fathers", "number": 22, "part": "Part Two: That World Inverted"},
            {"file": "text/part0205.html", "title": "Judas Kiss", "number": 23, "part": "Part Two: That World Inverted"},
            {"file": "text/part0206.html", "title": "Call It Peace", "number": 24, "part": "Part Two: That World Inverted"},
            {"file": "text/part0207.html", "title": "The Beauty of a Thousand Stars", "number": 0, "part": "Epilogue"},
        ],
        "coverImage": "images/00074.jpeg",
        "mapImage": "images/00076.jpeg",
    },
]


def clean_chapter_html(html_content):
    """Clean the chapter HTML for web display."""
    # Remove the book title prefix that appears at the start
    html_content = re.sub(r'<title>.*?</title>', '', html_content, flags=re.DOTALL)
    
    # Extract just the body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
    if body_match:
        html_content = body_match.group(1)
    
    # Remove style tags
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
    
    # Remove class attributes to use our own styling
    html_content = re.sub(r'\s+class="[^"]*"', '', html_content)
    
    # Remove id attributes  
    html_content = re.sub(r'\s+id="[^"]*"', '', html_content)
    
    # Fix image paths
    html_content = html_content.replace('src="../images/', 'src="/images/epub/')
    
    # Remove empty divs and spans
    html_content = re.sub(r'<div>\s*</div>', '', html_content)
    html_content = re.sub(r'<span>\s*</span>', '', html_content)
    
    # Clean up excessive whitespace but preserve paragraph structure
    html_content = re.sub(r'\n\s*\n\s*\n', '\n\n', html_content)
    
    return html_content.strip()


def estimate_reading_time(html_content):
    """Estimate reading time in minutes based on word count."""
    # Strip HTML tags to get text
    text = re.sub(r'<[^>]+>', '', html_content)
    word_count = len(text.split())
    # Average reading speed: 250 words per minute
    return max(1, round(word_count / 250))


def main():
    print("🔮 Parsing The Mortal Instruments EPUB...")
    print(f"   Source: {EPUB_FILE}")
    
    # Create output directories
    os.makedirs(CHAPTERS_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    with zipfile.ZipFile(EPUB_FILE, 'r') as z:
        # Extract images
        print("\n📸 Extracting images...")
        for name in z.namelist():
            if name.startswith('images/') and not name.endswith('/'):
                img_data = z.read(name)
                img_filename = os.path.basename(name)
                img_path = os.path.join(IMAGES_DIR, img_filename)
                with open(img_path, 'wb') as f:
                    f.write(img_data)
                print(f"   ✓ {img_filename}")
        
        # Extract cover
        if 'cover.jpeg' in z.namelist():
            cover_data = z.read('cover.jpeg')
            with open(os.path.join(IMAGES_DIR, 'cover.jpeg'), 'wb') as f:
                f.write(cover_data)
            print("   ✓ cover.jpeg")
        
        # Process each book
        manifest = {"books": []}
        
        for book in BOOKS:
            print(f"\n📖 Processing: {book['title']}...")
            book_dir = os.path.join(CHAPTERS_DIR, book['id'])
            os.makedirs(book_dir, exist_ok=True)
            
            book_manifest = {
                "id": book['id'],
                "title": book['title'],
                "bookNumber": book['bookNumber'],
                "year": book['year'],
                "tagline": book['tagline'],
                "color": book['color'],
                "coverImage": f"/images/epub/{os.path.basename(book['coverImage'])}",
                "mapImage": f"/images/epub/{os.path.basename(book['mapImage'])}",
                "chapters": [],
                "totalChapters": 0,
            }
            
            for ch in book['chapters']:
                # Read primary file
                html_content = z.read(ch['file']).decode('utf-8', errors='ignore')
                
                # If there are extra files (split chapters), append them
                if 'extra_files' in ch:
                    for extra in ch['extra_files']:
                        extra_content = z.read(extra).decode('utf-8', errors='ignore')
                        body_match = re.search(r'<body[^>]*>(.*?)</body>', extra_content, re.DOTALL)
                        if body_match:
                            html_content += body_match.group(1)
                
                cleaned = clean_chapter_html(html_content)
                reading_time = estimate_reading_time(cleaned)
                
                # Generate chapter ID
                if ch['number'] == 0:
                    ch_id = ch['title'].lower().replace(' ', '-').replace("'", '')
                    ch_filename = f"{ch['part'].lower().replace(' ', '_').replace(':', '')}.html"
                else:
                    ch_id = f"chapter-{ch['number']}"
                    ch_filename = f"chapter_{ch['number']:02d}.html"
                
                # Write chapter HTML
                ch_path = os.path.join(book_dir, ch_filename)
                with open(ch_path, 'w', encoding='utf-8') as f:
                    f.write(cleaned)
                
                ch_manifest = {
                    "id": ch_id,
                    "title": ch['title'],
                    "number": ch['number'],
                    "part": ch['part'],
                    "file": f"data/chapters/{book['id']}/{ch_filename}",
                    "readingTime": reading_time,
                }
                book_manifest['chapters'].append(ch_manifest)
                
                label = f"Ch.{ch['number']}" if ch['number'] > 0 else ch['part']
                print(f"   ✓ {label}: {ch['title']} (~{reading_time} min)")
            
            book_manifest['totalChapters'] = len(book_manifest['chapters'])
            manifest['books'].append(book_manifest)
        
        # Write manifest
        manifest_path = os.path.join(OUTPUT_DIR, 'books.json')
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        print(f"\n✅ Manifest written to {manifest_path}")
        
        # Summary
        total_chapters = sum(b['totalChapters'] for b in manifest['books'])
        print(f"\n📊 Summary:")
        print(f"   Books: {len(manifest['books'])}")
        print(f"   Total chapters: {total_chapters}")
        for b in manifest['books']:
            print(f"   - {b['title']}: {b['totalChapters']} chapters")


if __name__ == '__main__':
    main()
