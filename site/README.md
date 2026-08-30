# terjiman.bayrez.com — tanıtım sitesi

Tek dosyalık statik site. Derleme adımı yok, bağımlılık yok: `index.html`
kendi CSS ve JavaScript'ini içinde taşır. Dışarıdan yalnızca Google Fonts
yüklenir.

## Marka

BAYREZ Visual System v1.0 uygulanmıştır:

| Rol | Renk | Kullanım |
| --- | --- | --- |
| Kanvas | `#F7F8F6` off-white | ~%50 |
| Ses / metin | `#172A3D` navy | ~%30 |
| İmza | `#005F4D` deep teal | ~%10 — her başlıkta **tek** bir ifade |
| Ortam | `#DDF2EC` mint | yalnızca radyal yıkama, asla lineer |
| Mücevher | `#C39133` gold | ≤%3 — sadece eyebrow etiketlerindeki küçük kama |

Tipografi: **Space Grotesk** (Geo Grotesk yerine, başlıklar) + **Inter**
(gövde) + **IBM Plex Sans Arabic** (Arap yazısı). Uygurcaya özgü harfleri
(ې ۆ ۈ ڭ) IBM Plex taşımazsa diye font yığınında **Noto Sans Arabic** yedek
olarak durur.

Uygulanan sistem öğeleri: buzlu cam kart (ince beyaz kenarlık, geniş köşe,
teal gölge), kenardan taşan yumuşak claymorphic obje, asimetrik yerleşim,
bol beyaz alan.

**Karanlık tema yok.** "Never dark canvases" marka kuralı gereği sayfa tek bir
görsel dünyaya bağlıdır ve her rengi açıkça boyar; ziyaretçinin sistem teması
koyu olsa bile kanvas off-white kalır.

### Şahin filigranı — eksik parça

Sistem, 8% opaklıkta bir köşede BAYREZ şahin siluetini istiyor. Elimde asıl
şahin varlığı olmadığı için **yer tutucu bırakılmıştır**: `.falcon` sınıfının
stili hazır, işaretleme boş. Gerçek SVG'yi `.hero`, `.uyghur` veya
`.download` içine `<svg class="falcon">` olarak koymanız yeterli — bölüm
başına bir tane, fazlası değil.

## İçerik

| Dosya | Ne işe yarar |
| --- | --- |
| `index.html` | Sitenin tamamı — işaretleme, stil, üç dilli metinler, canlı çeviri animasyonu |
| `brand-icon.svg` | Terjiman markası, marka paletinde |
| `icon.png`, `favicon.png` | `brand-icon.svg`'den üretilir |
| `Dockerfile` | nginx-unprivileged, 8080 portu |
| `nginx.conf` | Gzip, önbellek ve güvenlik başlıkları |

İkonları yeniden üretmek için:

```bash
npm install --no-save sharp
node -e "const s=require('sharp');s('site/brand-icon.svg').resize(1024,1024).png().toFile('site/icon.png');s('site/brand-icon.svg').resize(48,48).png().toFile('site/favicon.png')"
```

## Yerelde çalıştırma

```bash
cd site
python3 -m http.server 8000   # http://localhost:8000
```

Docker ile:

```bash
docker build -t terjiman-site ./site
docker run --rm -p 8080:8080 terjiman-site
```

## Coolify ile yayına alma

1. **Project → New Resource → Application**, bu depoyu seçin.
2. Build Pack: **Dockerfile**.
3. **Base Directory**: `site` · **Dockerfile Location**: `Dockerfile`.
4. **Port**: `8080`.
5. **Domains**: `https://terjiman.bayrez.com` — `terjiman` için `A` kaydını
   sunucunun IP'sine yönlendirin.
6. **Force HTTPS** açık kalsın.

Ortam değişkeni gerekmez; site tamamen statiktir ve arka uçla konuşmaz.

## Diller

Türkçe, İngilizce ve Uygurca. Sağ üstteki `TR / EN / UG` düğmeleriyle değişir
ve seçim tarayıcıda hatırlanır. Uygurca seçildiğinde sayfa `dir="rtl"` olur ve
düzen bütünüyle aynalanır.

Türkçe metin doğrudan işaretlemededir (sözlükte tekrarlanmaz); İngilizce ve
Uygurca karşılıklar `index.html` içindeki `STRINGS` sözlüğünde `data-i18n`
anahtarlarıyla eşleşir. Yeni cümle eklerken üç yere de ekleyin: işaretlemeye
`data-i18n="anahtar"`, sonra `STRINGS.en` ve `STRINGS.ug`.

Başlıklar üç parçaya bölünmüştür (`t1`, `t2`, `t3`) — çünkü marka kuralı her
başlıkta **tek** bir ifadenin deep teal olmasını istiyor; teal olan parça
`t2`'dir.

Uygurcada şirket adı **بايرېز FZE LLC** olarak yazılır (`foot.company`).

## Bağlantılar

Site dışına yalnızca iki bağlantı çıkar:

- Footer'daki **BAYREZ FZE LLC** → `bayrez.com` (BAYREZ kim sorusunun cevabı)
- **hello@bayrez.com** → `mailto:`

Başka geri bağlantı yoktur; `/contact-us/` gibi adresler bilinçli olarak
kullanılmamıştır.

## Mağaza bağlantıları

Uygulama henüz yayında olmadığı için App Store ve Google Play butonları
`href="#"` ile durur. İki yerde geçer (hero ve indirme bandı) ve her birinin
üstünde HTML yorumu vardır:

```html
<!-- App Store adresi belli olunca href="#" yerine yazın. -->
```

Apple veya Google'ın resmî mağaza rozetleri **kullanılmamıştır** (telif);
butonlar özgün tipografi ve nötr ikonlarla çizilmiştir. Yayına çıkınca
`hero.store` ve `dl.note` metinlerini de güncelleyin.

## Ekran görüntüsü / önizleme

Fontlar Google Fonts'tan geldiği için, ağ erişimi olmayan bir ortamda açarsanız
yedek fontlar görünür. Yayında sorun olmaz.
