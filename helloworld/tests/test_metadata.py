"""Crawler-visible metadata is a static HTML contract."""
from html.parser import HTMLParser
from pathlib import Path
import struct
import unittest

ROOT = Path(__file__).resolve().parents[1]


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.metadata = {}
        self.in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = attrs.get("property", attrs.get("name"))
            if key:
                self.metadata.setdefault(key, []).append(attrs.get("content"))
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


class StaticMetadataTests(unittest.TestCase):
    def test_english_preview_is_complete_without_javascript(self):
        head = HeadParser()
        head.feed((ROOT / "index.html").read_text())
        title = "Hello World! – Geography quiz and interactive world map"
        description = (
            "Play a geography quiz, explore an interactive world map, and learn "
            "countries, flags and capitals with flashcards. Available in English and Norwegian."
        )
        image = "https://lanceolav.com/helloworld/icons/app-icon-512.png"
        expected = {
            "description": description,
            "og:title": title,
            "og:description": description,
            "og:type": "website",
            "og:url": "https://lanceolav.com/helloworld/",
            "og:locale": "en_GB",
            "og:locale:alternate": "nb_NO",
            "og:image": image,
            "og:image:type": "image/png",
            "og:image:width": "512",
            "og:image:height": "512",
            "twitter:card": "summary",
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": image,
        }
        self.assertEqual(head.title, title)
        for key, value in expected.items():
            with self.subTest(key=key):
                self.assertEqual(head.metadata.get(key), [value])
        self.assertTrue(head.metadata["og:image:alt"][0])
        self.assertEqual(head.metadata["twitter:image:alt"], head.metadata["og:image:alt"])
        png = (ROOT / "icons/app-icon-512.png").read_bytes()
        self.assertEqual(png[:8], b"\x89PNG\r\n\x1a\n")
        self.assertEqual(struct.unpack(">II", png[16:24]), (512, 512))
