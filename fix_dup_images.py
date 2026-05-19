# -*- coding: utf-8 -*-
import urllib2
import json

SUPABASE_URL = "https://nbdpckerbphyfnjzqiqp.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHBja2VyYnBoeWZuanpxaXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQzMjAzMiwiZXhwIjoyMDk0MDA4MDMyfQ.WmcAF24VIujpZ_U3QwBFyMzCcHCCoXPRSvcOBPOXmFA"
BASE = SUPABASE_URL + "/rest/v1/products"
STORAGE = "https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": "Bearer " + SERVICE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Fix duplicate images
updates = [
    # 로제 파스타: was sharing hankki-buldakroze.png with 불닭 → use manrep.png
    (u"한끼 도시락 - 로제 파스타", STORAGE + "manrep.png"),
    # 닭가슴살 퀴노아볼: was sharing hankki-dakgaseum.png → hankki-dakgalbi.png (chicken dish)
    (u"닭가슴살 퀴노아볼", STORAGE + "hankki-dakgalbi.png"),
    # 크림 리조또: was sharing manrep-omurice.png with 파스타 카르보나라 → hankki-set.jpg
    (u"크림 리조또", STORAGE + "hankki-set.jpg"),
    # 비건 카레: was sharing manrep-avocado.png → manrep-jekyuk.png
    (u"비건 카레", STORAGE + "manrep-jekyuk.png"),
    # 저칼로리 채소 도시락: was sharing manrep-avocado.png → manrep-6jong.png
    (u"저칼로리 채소 도시락", STORAGE + "manrep-6jong.png"),
    # 토마토 볼로네제: was sharing hankki-bulgogi.png with 불고기 → manrep-tteokgalbi.png
    (u"토마토 볼로네제", STORAGE + "manrep-tteokgalbi.png"),
    # 부대찌개 → butter-tteok? No, let's use manrep-set.png for 비건 두부스테이크
    # 비건 두부스테이크: was sharing manrep-avocado with 비건카레, 저칼로리 → manrep-set.png
    (u"비건 두부스테이크", STORAGE + "manrep-set.png"),
]

import urllib

for name, image_url in updates:
    encoded = urllib.quote(name.encode('utf-8'), safe='')
    url = BASE + "?name=eq." + encoded
    data = json.dumps({"image_url": image_url})
    req = urllib2.Request(url, data, HEADERS)
    req.get_method = lambda: 'PATCH'
    try:
        resp = urllib2.urlopen(req)
        print("OK: " + name.encode('utf-8') + " -> " + image_url.split('/')[-1])
    except urllib2.HTTPError as e:
        print("ERR " + str(e.code) + ": " + name.encode('utf-8') + " - " + e.read())

print("Done!")
