# terjiman.bayrez.com — tanıtım sitesi

Tek dosyalık statik site. Derleme adımı yok, bağımlılık yok: `index.html`
kendi CSS ve JavaScript'ini içinde taşır. Dışarıdan yalnızca Google Fonts'tan
Inter ve Noto Sans Arabic yüklenir.

## İçerik

| Dosya | Ne işe yarar |
| --- | --- |
| `index.html` | Sitenin tamamı — işaretleme, stil, üç dilli metinler, canlı çeviri animasyonu |
| `icon.png`, `favicon.png` | Uygulama simgesinden üretilir (`mobile/assets/`) |
| `Dockerfile` | nginx-unprivileged, 8080 portu |
| `nginx.conf` | Gzip, önbellek ve güvenlik başlıkları |

## Yerelde çalıştırma

```bash
cd site
python3 -m http.server 8000
# http://localhost:8000
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
6. **Force HTTPS** açık kalsın; Let's Encrypt sertifikası DNS çözülür çözülmez
   otomatik alınır.

Ortam değişkeni gerekmez. Site tamamen statiktir ve arka uçla konuşmaz.

## Diller

Arayüz Türkçe, İngilizce ve Uygurca sunar; sağ üstteki `TR / EN / UG`
düğmeleriyle değişir ve seçim tarayıcıda hatırlanır. Uygurca seçildiğinde
sayfa `dir="rtl"` olur ve düzen bütünüyle aynalanır.

Metinler `index.html` içindeki `STRINGS` sözlüğündedir. Türkçe metin doğrudan
işaretlemede durur (sözlükte tekrarlanmaz); İngilizce ve Uygurca karşılıklar
`data-i18n` anahtarlarıyla eşleşir. Yeni bir cümle eklerken üç yere de eklemek
gerekir: işaretlemeye `data-i18n="anahtar"` ile, sonra `STRINGS.en` ve
`STRINGS.ug` içine.

## Metin ve iddialar

Sayfadaki her iddia üründe gerçekten karşılığı olan davranışı anlatır. Mağaza
bağlantısı yoktur; uygulama yayımlanmadığı için çağrı butonu BAYREZ iletişim
sayfasına gider. Apple veya Google'ın mağaza rozetleri kullanılmamıştır.
Uygulama mağazalara çıktığında `hero.store` metnini gerçek bağlantılarla
değiştirin.

## Ekran görüntüsü / önizleme

Fontlar Google Fonts'tan geldiği için, ağ erişimi olmayan bir ortamda
açtığınızda Arap yazısı yedek fontla görünür. Yayında sorun olmaz.
