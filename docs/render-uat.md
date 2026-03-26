# Render UAT

Ta konfiguracja służy do postawienia publicznego środowiska UAT dla `Movid Psychodietetyka`.

## Co dostajesz

- publiczny adres `onrender.com`
- ochronę hasłem przez HTTP Basic Auth
- zapis rekordów do SQLite
- trwały dysk dla danych testowych
- panel UAT pod `/uat`

## Ważne

Środowisko z SQLite na Render wymaga persistent disku, bo bez niego system plików jest efemeryczny i rekordy znikają po restarcie lub redeployu.

## Jak wdrożyć

1. Wypchnij repozytorium na GitHub.
2. Zaloguj się do Render.
3. Wybierz `New +` -> `Blueprint`.
4. Wskaż repo z tym projektem.
5. Render wykryje plik `render.yaml`.
6. Uzupełnij sekrety:
   - `UAT_BASIC_AUTH_USER`
   - `UAT_BASIC_AUTH_PASSWORD`
7. Zatwierdź utworzenie usługi.

## Po wdrożeniu

- strona główna: `https://twoj-serwis.onrender.com`
- panel testowy: `https://twoj-serwis.onrender.com/uat`

## Testowanie

1. Zaloguj się podanym loginem i hasłem.
2. Przejdź przez formularz rezerwacji i formularz kontaktowy.
3. Wejdź do `/uat`, aby zobaczyć:
   - rezerwacje
   - wiadomości kontaktowe
   - testowe zdarzenia mailowe
4. Jeśli chcesz zacząć od zera, użyj przycisku czyszczenia danych testowych.
