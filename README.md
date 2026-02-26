# Opis Rozwiązania

## Analiza danych

Z danych dostarczonych wraz z zadaniem skupiłem się na następujących cechach zamówień:

- całkowity przychód (revenue) - wyliczany z _unitPrice \* quantity_,
- liczbę zamówień (orders),
- liczbę zamówionych przedmiotów (items),
- timestamp zamówienia,
- typ klienta (nowy | stały),
- kategorie i podkategorie,
- dane geograficzne (państwo, miasto i koordynaty),
- czas dostawy.

Do pierwszych trzech będę się odnosił jako **metryki sprzedaży**.

Warto dodać, że dostarczone dane są wyjątkowo małą próbką większych danych. Wybierając wykresy normalnie sprawdzałbym zależności w danych oraz przedstawiał jedynie te wnoszące nieoczywiste informacje. Dobierając więc je w tym przypadku postawiłem na takie wykresy, które sprawdziłyby się wizualnie też na większych danych, a jednocześnie mogłyby być podstawą do analiz. Każdy wykres korzysta też z znacznie innego zestawu informacji - specjalnie dobrałem je w taki sposób, aby pokryć i dobrze zwizualizować złożoność i możliwości danych.

Dostarczone dane też były w pewien sposób nieokreślone i wymagały dokonania pewnych założeń:

- jeden obiekt w liście `orders` jest jedynie fragmentem całego zamówienia jednoznacznie identyfikowanego przez orderId,
- wszystkie obiekty należące do jednego pełnego zamówienia dzielą lokalizację, czas zamówienia i dostawy, typ klienta, ...,
- kategorii oraz podkategorii może być całkiem dużo, ale w logicznej liczbie w kontekście przedstawiania na wykresach (w przeciwieństwie do samych produktów),
- nie ma innych typów klienta niż `returning` i `new`,
- zakres dat to niekoniecznie 1 tydzień czy 1 miesiąc, może być to kilka lat.

Założenia te są kluczowe do poprawnego zliczania danych (w szczególności liczby zamówień) oraz przedstawiania ich na wykresie (lepiej jakby nie było 300 kolumn obok siebie...).

W celu sprawdzenia działania moich wykresów napisałem też sobie prosty generator danych (`scripts/generate-data.js`). Generuje od dane zgodne z moimi założeniami, ale w dowolnej liczbie - nie tylko 10.

## Wykresy

Przygotowałem 3 wykresy:

### 1. Wykres przedstawiający zależność **metryk sprzedaży** generowanych przez **nowych / stałych** klientów w czasie.

Jest on odpowiedzią na pytanie "Komu sprzedajemy?". Każda z metryk sprzedaży pozwala przeanalizować nieco inny aspekt sprzedaży do obu grup klientów:

- Przychód wskazuje, która grupa generuje firmie większy zysk. Może ona być przez to priorytetowa, ale może być też tak, że ta druga jest zaniedbywana.
- Liczba zamówień pokazuje, jak chętnie dani klienci zamawiają. Można z tego wiele wniosków wysnuć. Przykładowo, niewielka liczba nowych klientów może oznaczać niedziałającą strategię marketingową.
- Liczba zamówionych przedmiotów pomaga zrozumieć w jaki sposób generowany jest przychód. Ponadto, w przypadku stałych klientów, wysoka liczba przedmiotów przy stałej liczbie zamówień świadczy o ich rosnącym zaufaniu do firmy.

Przedstawienie w czasie pozwala odczytać, jakie skutki przynosiły konkretne działania firmy w przeszłości, a także pozwala zauważyć trendy w specyficznych okresach roku (np. grudniowy przyrost nowych klientów).

Do przedstawienia tej zależności wybrałem zwykły i dobrze znany wykres liniowy. Brak szumu w postaci nadprogramowych pól pod linią pozwala czytelniej odczytywać wartości. Linie o konkretnych metrykach nie są przedstawione jednocześnie, a metrykę wybiera się przy pomocy dedykowanego okienka. Finalnie, poza zwyczajnym przedstawieniem danych dodałem również opcje wykresu kumulowanego. Taki tryb zmienia perspektywę patrzenia na dane - z punktowego działania firmy w danym momencie na prędkość jej rozwoju.

### 2. Wykres przedstawiający przychód generowany przez zamówienia z konkretnej (pod)kategorii.

Jest odpowiedzią na pytanie "Co sprzedajemy?". Pozwala zidentyfikować te (pod)kategorie produktów, które nie przynoszą firmie żądanego zysku, bądź przynoszą największy. Można zobaczyć, czy zysk ten wynika z wysokiej liczby zamówień / liczby produktów czy z wysokiej ceny produktów.

Do przedstawienia wartości wybrałem wykres kolumnowy z opcją 'drilldown'. Pozwala on w bardzo przystępny sposób przedstawić dwupoziomową strukturę kategorii w tej firmie. Kolumna przedstawia przychód generowany przez daną kategorię, a po kliknięciu w nią pokazuje się podobny wykres kolumnowy dla jej podkategorii.

### 3. Mapa 'bubbleMap' przedstawiająca rozkład zamówień i średni czas dostawy.

Jest odpowiedzią na pytanie "Gdzie sprzedajemy?". Mapa wypełniona jest bąbelkami. Rozmiar bąbla zależy od liczby zamówień w danym obszarze (im większy tym więcej zamówień). Kolor bąbla opisuje średni czas dostawy (zielony szybko - 0 dni, czerwony wolno - 10 dni). Duże, czerwone, rzucające się w oczy bąble są miejscami problematycznymi, w których jest duży popyt, ale dostawa jest powolna. Może ona wskazywać na obszary, w których należałoby zwiększyć liczbę dostawców, a może nawet postawić jakieś centrum logistyczne. Niezadowolenie klientów wynikające z czasu dostawy to ważny czynnik w czasach, gdzie konkurencja jest tak wielka, a jedno złe zamówienie może zadecydować o ewentualnym powrocie klienta.

Dane dzieliłem na państwa, a przy odpowiednim przybliżeniu jeden krajowy bąbel dzieli się na poszczególne miasta. Współrzędne są średnią wszystkich koordynatów z danego klastra (jest zatem szansa, np. przy Grecji, że bąbel pokaże się na morzu).

## Dodatkowe funkcjonalności

- tooltipy - przy najechaniu na dowolny punkt wykresu, kolumnę czy bąbel na mapie pokazuje się okienko z dodatkowymi informacjami (głównie metryki sprzedaży)
- filtrowanie po dacie - nie znam ram czasowych danych, a nie wyobrażam sobie rozsądnej analizy bazując jedynie na danych z całej historii. Na górze ekranu jest więc okienko z wyborem okresu. Postawiłem na opcje _ostatni miesiąc_, _ostatni rok_ i _całe dane_, gdyż są one względnie uniwersalne. Przy danych z roku lub więcej, dane grupowane są tygodniami - aby zachować czystość wykresu liniowego. Bez tego grupowania pojawiał się tam zupełny szum. Zamiast tych 3 opcji, mogłem dodać kalendarz z wyborem zakresu dat i pewnie byłoby to nawet prostsze w zaimplementowaniu, ale uznałem, że wielu osobom się teraz zwyczajnie nie chce wybierać dokładnych dat na kalendarzu. Finalnie taka kwestia jest czymś do uzgodnienia.
- wybór danych - Na górze ekranu jest również okienko z możliwością wybrania zestawu danych - te małe z `data.txt` oraz wygenerowane losowo.

## Uruchomienie projektu

### Wymagania wstępne

- **Node.js** (wersja 22 lub nowsza)
- menedżer pakietów **npm**


### Instalacja

1. Sklonuj repozytorium

```
git clone <adres repozytorium>

```
lub pobierz jako zip i rozpakuj

2. Przejdź do katalogu aplikacji `ecommerce-dashboard`
```
cd <nazwa folderu z repozytorium>/ecommerce-dashboard
```

3. Zainstaluj zależności

```
npm install
```

4. Uruchom aplikację w trybie deweloperskim

```
npm run dev
```

5. Otwórz aplikację
   Aplikacja powinna być dostępna pod adresem http://localhost:5173 . (Upewnij się, że inne projekty nie są uruchomione)
