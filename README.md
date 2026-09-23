# Orléans Board Game Companion & Scoring Calculator

Besplatan digitalni asistent za društvenu igru **Orléans** i zvanične ekspanzije:
- **Osnovna igra (Base Game)**
- **Trade & Intrigue (Trgovina i Intrige)**
- **Invasion (Velika ekspanzija sa 6 scenarija: Prosperity, Co-op City Defense, The Duel, Solo modovi)**

Kreiran kao open-source projekat prilagođen za igranje za stolom, tablete i telefone, sa dvojezičnom podrškom (Srpski / Engleski).

---

## ✨ Glavne funkcionalnosti (Features)

### 1. 🛠️ Vodič za Setup (Setup Helper)
- **Osnovna igra (2, 3 i 4 igrača):**
  - Tačan spisak neutralnih pratilaca za uklanjanje (32 za 2p, 17 za 3p, puna tabla za 4p).
  - Ograničenja polja na mapi ("3" i "4" polja).
  - **Generator nasumičnog uklanjanja robe (Goods Randomizer):** automatizuje uklanjanje 12 ili 6 žetona robe.
- **Trade & Intrigue:**
  - Modul Narudžbina (23 Orders karte).
  - Novi špil događaja (34 karte A, B, C, D + Silentium).
  - Nova tabla Segensreiche Werke i tabla Intriga (Intrigue board).
- **Invasion (6 Scenarija):**
  - **Prosperity (Blagostanje 2-5p):** tabla sa 16 događaja, Stolar (Carpenter), karte Građevina (Structures), skrivena roba licem nadole.
  - **Co-op City Defense (Odbrana grada 2-5p):** tabla City Defense, 5 zajedničkih ciljeva, 9 karata ličnih uloga sa ciljevima, utvrđene kule na ivici mape.
  - **The Duel (Trgovački dvoboj za 2 igrača):** 16 rundi, 4 cilja, tabla Građanske kuće (Bourgeois House).
  - **Solo scenariji:** The Dignitary (Velikodostojnik), Capital Vierzon, Travelling Salesman.

### 2. 🏆 Kalkulator završnog bodovanja (Final Scoring Calculator)
- Podrška za 2 do 5 igrača (uključujući 5. crnog/sivog igrača iz ekspanzije Invasion).
- **Osnovno bodovanje:** Novac + Roba (Brokat 5, Vuna 4, Vino 3, Sir 2, Žito 1) + `(Trgovačke ispostave + Građani) × Nivo Razvoja (1-6)`.
- **Trade & Intrigue bodovanje:**
  - Dodatni poeni za ispunjene Narudžbine (Orders VP).
  - Kuća trgovca (*Handelshaus*): +4 VP za svaku vrstu robe u kojoj igrač ima strogu većinu.
- **Invasion: Prosperity bodovanje:**
  - Poeni za završene Građevine (completed Structures pod neutralnim markerom).
  - Skladište (*Depot / Lagerhaus*): +5 VP za svaki kompletan set od svih 5 različitih vrsta robe.
  - Izuzetak pravila: Građevine na putnoj robi se ne množe sa nivoom razvoja (samo trgovačke ispostave u gradovima).
- **Invasion: Kooperativna Odbrana Grada (Co-op Victory Evaluator):**
  - Interaktivna provera svih 5 zajedničkih ciljeva (Zidine/Vitezovi, Građani, Riznica, Magacin robe, Kule) + lični ciljevi karaktera sa automatskim proglašenjem pobede ili poraza!
- **The Duel & Solo Scenarios Evaluatori.**

### 3. 📖 Katalog i Enciklopedija Događaja (Events Codex)
- Pretraživi katalog svih događaja sa originalnim nemačkim nazivima (*Bücherbrand*, *Ablass*, *Bauernaufstand*, *Pest*, *Feuersturm* itd.).
- Podrška za osnovnu igru, Trade & Intrigue i Invasion.
- Filteri po fazama, težini (bonusi, kazne, zabrane, porezi) i pravila Mučenja (Torture).

### 4. 📜 Katalog svih 30 zgrada (Place Tiles Codex)
- Svih 20 zgrada iz osnovne igre.
- 3 zgrade iz *Trade & Intrigue*: Brasserie, Merchant House, Sheep Farm.
- 7 zgrada iz *Invasion*: Market Stand, Black Market, Tavern, Vineyard, Depot (Lagerhaus), Well (Bunar), Stage Coach.
- Filtriranje po ekspanziji, kategoriji (I i II), tipu efekta i pretraga po nemačkom i srpskom/engleskom nazivu.

### 4. ⏳ Praćenje rundi i pravilnik
- 18 i 16 rundi, vodič kroz 7 faza, pravilo Popisa (Census), pravilo Mučenja (Torture), i pravila za postavljanje Tehnologija (zupčanika).

---

## 🚀 Pokretanje projekta (Development & Build)

```bash
# Instalacija zavisnosti
npm install

# Pokretanje razvojnog servera
npm run dev

# Build za produkciju
npm run build
```

---

## 📜 Licenca
Ovaj projekat je besplatan i open-source pod MIT licencom.
Društvena igra *Orléans*, *Trade & Intrigue* i *Invasion* su autorska dela Reinera Stockhausena, Inke & Markusa Branda i dlp games.
