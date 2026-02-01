# Reality Kalkulačka Pro - MEVERIK SOLUTION

Moderní webová aplikace pro ocenění nemovitostí s pokročilými funkcemi pro investory, bankovní odhadce a širokou veřejnost.

## 🚀 Nové Funkce

### ✨ Vylepšení oproti původní verzi:
- **Moderní UI/UX** - Čistý design v barvách krémová, olivová, šedá, vanilková, černá, perletově bílá
- **Multi-property management** - Správa více nemovitostí v rámci jednoho projektu
- **Opravený JSON import/export** - Plně funkční s podporou katastrálních dat
- **Katastrální integrace** - Vyhledávání podle parcelního čísla a obce
- **Historická data** - Cenové trendy až 3 roky zpět
- **Pokročilé analýzy** - Více metod ocenění s váženým průměrem
- **Souhrnné reporty** - Profesionální PDF reporty pro celý projekt
- **Responzivní design** - Optimalizováno pro desktop/laptop, funkční i na mobilu

### 🏠 Hlavní Funkce:
1. **Správa projektů** - Organizace nemovitostí do projektů
2. **Katastrální vyhledávání** - Automatické načítání dat z katastru
3. **Více metod ocenění**:
   - Porovnávací metoda
   - Nákladová metoda  
   - Výnosová metoda
4. **Tržní analýza** - Cenové trendy a regionální srovnání
5. **Investiční metriky** - ROI, IRR, Cap Rate, Payback Period
6. **Profesionální reporty** - Export do PDF, Excel, HTML

## 🛠️ Technologie

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS s moderním designem
- **Charts**: Chart.js pro vizualizace
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## 📱 Kompatibilita

- **Primární**: Desktop/Laptop (Chrome, Firefox, Safari, Edge)
- **Sekundární**: Mobilní zařízení (responzivní design)
- **Tisk**: Optimalizováno pro PDF export

## 🚀 Nasazení na Vercel

### Automatické nasazení:
1. Nahrajte soubory do GitHub repository
2. Připojte repository k Vercel
3. Vercel automaticky nasadí aplikaci

### Manuální nasazení:
```bash
# Nainstalujte Vercel CLI
npm i -g vercel

# V adresáři s aplikací spusťte:
vercel

# Pro produkční nasazení:
vercel --prod
```

## 📁 Struktura Souborů

```
reality-kalkulacka-pro/
├── index.html          # Hlavní HTML soubor
├── styles.css          # CSS styly
├── script.js           # JavaScript logika
├── vercel.json         # Konfigurace pro Vercel
└── README.md           # Dokumentace
```

## 🎨 Design System

### Barevná Paleta:
- **Krémová**: `#F5F5DC` - Pozadí a akcenty
- **Olivová**: `#6B7C32` - Primární barva
- **Šedá**: `#6B7280` - Sekundární barva
- **Vanilková**: `#F3E5AB` - Zvýraznění
- **Černá**: `#1F2937` - Text
- **Perletově bílá**: `#FEFEFE` - Pozadí

### Typografie:
- **Font**: Inter (Google Fonts)
- **Velikosti**: 12px - 30px (responzivní škála)
- **Váhy**: 300, 400, 500, 600, 700

## 🔧 Konfigurace

### Katastrální API:
Aplikace obsahuje mock implementaci katastrálního API. Pro produkční použití nahraďte `CadastralAPI` třídu skutečnou integrací.

### Cenová Data:
Cenové modely jsou založené na demo datech. Pro produkční použití aktualizujte `PricingData` objekt s reálnými tržními daty.

## 📊 Funkce Aplikace

### 1. Správa Projektů
- Vytváření a editace projektů
- Základní informace o společnosti
- Poznámky a metadata

### 2. Správa Nemovitostí
- Přidávání více nemovitostí do projektu
- Detailní parametry každé nemovitosti
- Katastrální vyhledávání

### 3. Analýzy a Reporty
- Cenové trendy (historické + projekce)
- Regionální srovnání
- Investiční metriky
- Katastrální mapy

### 4. Export a Import
- JSON export/import s kompatibilitou starších verzí
- PDF reporty
- Excel export
- HTML reporty

## 🔄 Migrace ze Starší Verze

Aplikace automaticky rozpozná a převede data z verze 3.x:
- Zachová všechna existující data
- Převede do nového formátu
- Přidá nové funkce bez ztráty dat

## 🐛 Řešení Problémů

### Časté Problémy:
1. **JSON import nefunguje**: Zkontrolujte formát dat
2. **Mapa se nenačítá**: Zkontrolujte internetové připojení
3. **PDF export**: Použijte funkci tisku prohlížeče

### Podpora:
Pro technickou podporu kontaktujte MEVERIK SOLUTION.

## 📄 Licence

© 2024 MEVERIK SOLUTION - Reality Kalkulačka Pro

---

**Verze**: 4.0  
**Datum**: 2024  
**Autor**: MEVERIK SOLUTION