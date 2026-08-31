# Brand names by language

The official naming, one row per language, in the pattern
**product — descriptor — company**. Everything user-facing draws from this
table, and no string ever mixes scripts.

| Language | Full name | Product | Descriptor | Company |
| --- | --- | --- | --- | --- |
| ئۇيغۇرچە (ug) | ئۇيغۇر تەرجىمان - بايرېز | تەرجىمان | ئۇيغۇر تەرجىمان | بايرېز |
| English (en) | Terjiman - Uyghur Translator - Bayrez | Terjiman | Uyghur Translator | Bayrez |
| Türkçe (tr) | Tercüman - Uygur Çevirmen - Bayrez | Tercüman | Uygur Çevirmen | Bayrez |
| العربية (ar) | ترجيمان - المترجم الأويغوري - بايريز | ترجيمان | المترجم الأويغوري | بايريز |
| 简体中文 (zh-Hans) | 特尔吉曼 - 维吾尔语翻译 - 贝瑞兹 | 特尔吉曼 | 维吾尔语翻译 | 贝瑞兹 |
| 繁體中文 (zh-Hant) | 特爾吉曼 - 維吾爾語翻譯 - 贝瑞兹 | 特爾吉曼 | 維吾爾語翻譯 | 贝瑞兹 |
| اردو (ur) | ترجیمان - اویغور ترجمان - بايريز | ترجیمان | اویغور ترجمان | بايريز |
| Русский (ru) | Терджиман - Уйгурский переводчик - Bayrez | Терджиман | Уйгурский переводчик | Bayrez |
| Қазақша (kk) | Тәржіман - Ұйғыр аудармашысы - Bayrez | Тәржіман | Ұйғыр аудармашысы | Bayrez |
| O'zbekcha (uz) | Tarjimon - Uyg'ur tarjimoni - Bayrez | Tarjimon | Uyg'ur tarjimoni | Bayrez |
| Français (fr) | Terjiman - Traducteur Ouïghour - Bayrez | Terjiman | Traducteur Ouïghour | Bayrez |
| Deutsch (de) | Terjiman - Uigurischer Übersetzer - Bayrez | Terjiman | Uigurischer Übersetzer | Bayrez |
| Español (es) | Terjiman - Traductor Uigur - Bayrez | Terjiman | Traductor Uigur | Bayrez |

## Where each part is used

**Product + company** — the wordmark, shown together in the app header, the
About screen and the site's navigation and footer. Never abbreviated to
initials, never paired across scripts.

**Descriptor** — the tagline under the wordmark, and the keyword half of an
app-store title.

**Full name** — the app-store listing title, the site's `<title>`, its Open
Graph tags and the `name` field in its structured data.

## Implemented today

The app ships four interface languages, so those four rows are live in
`mobile/src/i18n/`:

| Locale | `common.appName` | `common.company` | `common.tagline` |
| --- | --- | --- | --- |
| ug | تەرجىمان | بايرېز | ئۇيغۇر تەرجىمان |
| en | Terjiman | Bayrez | Uyghur Translator |
| tr | Tercüman | Bayrez | Uygur Çevirmen |
| ar | ترجيمان | بايريز | المترجم الأويغوري |

The site ships Uyghur, Turkish and English, in `site/index.html` under the
`brand.name` and `brand.company` keys.

The remaining rows are not used in the interface yet — the app has no Chinese,
Urdu, Russian, Kazakh, Uzbek, French, German or Spanish interface. They are
recorded here for the store listings and for whenever those interface
languages are added. (Translation *between* all thirteen languages already
works; this table is about the interface.)

## Two points to confirm

1. **Traditional Chinese company name.** The row reads 贝瑞兹, which is the
   simplified form — the same string as the Simplified Chinese row. The
   traditional form would be 貝瑞茲. Left exactly as supplied; correct it here
   if the traditional spelling is intended.

2. **Launcher and store name.** `expo.name` and the iOS display name are plain
   `Terjiman`, so the icon caption stays short and in one script on every
   device. The full localized names above belong in the store listing, which is
   configured in App Store Connect and Google Play Console rather than in this
   repository.
