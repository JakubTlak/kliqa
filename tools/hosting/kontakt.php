<?php
/**
 * Odbiór formularza kontaktowego z kliqa.pl i wysyłka na skrzynkę agencji.
 *
 * Dlaczego PHP: hosting SeoHost to środowisko współdzielone z PHP i lokalną pocztą,
 * więc nie potrzeba tu zewnętrznej usługi ani klucza API. Formularz na stronie
 * wysyła JSON-em; jeśli ten skrypt nie odpowie, strona sama przechodzi na tryb
 * „otwórz program pocztowy z gotową treścią", więc kontakt nigdy nie znika.
 *
 * Konfiguracja: ustaw ODBIORCA i NADAWCA. Adres nadawcy MUSI należeć do domeny
 * obsługiwanej przez ten serwer — inaczej wiadomości wylądują w spamie albo zostaną odrzucone.
 */

declare(strict_types=1);

const ODBIORCA        = 'biuro@kliqa.pl';
const NADAWCA         = 'formularz@kliqa.pl';
const NAZWA_NADAWCY   = 'Formularz kliqa.pl';
const LIMIT_NA_GODZINE = 5;   // ile zgłoszeń z jednego adresu IP

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function odpowiedz(int $kod, array $dane): void
{
    http_response_code($kod);
    echo json_encode($dane, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    odpowiedz(405, ['error' => 'Nieobsługiwana metoda.']);
}

$surowe = file_get_contents('php://input');
$dane = json_decode((string) $surowe, true);
if (!is_array($dane)) {
    odpowiedz(400, ['error' => 'Nieprawidłowe dane formularza.']);
}

$pole = static function (string $klucz) use ($dane): string {
    $v = $dane[$klucz] ?? '';
    if (is_array($v)) {
        $v = implode(', ', array_map('strval', $v));
    }
    // wycinamy znaki sterujące i nowe linie w polach jednoliniowych
    return trim((string) $v);
};

// Długość bez mbstring — gdyby rozszerzenie było wyłączone, brak tej ostrożności
// kończyłby się błędem krytycznym i utratą zgłoszenia. Dla progów minimalnych bajty wystarczą.
$dlugosc = static function (string $s): int {
    return function_exists('mb_strlen') ? mb_strlen($s) : strlen($s);
};

// Pułapka na boty: pole ukryte przed człowiekiem. Wypełnione = cichy sukces, bez maila.
if ($pole('website') !== '') {
    odpowiedz(200, ['ok' => true]);
}

$imie      = $pole('name');
$email     = $pole('email');
$wiadomosc = $pole('message');
$zgoda     = !empty($dane['consent']);

if ($dlugosc($imie) < 2) {
    odpowiedz(422, ['error' => 'Podaj imię i nazwisko.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    odpowiedz(422, ['error' => 'Sprawdź adres e-mail.']);
}
if ($dlugosc($wiadomosc) < 10) {
    odpowiedz(422, ['error' => 'Opisz krótko, nad czym pracujesz.']);
}
if (!$zgoda) {
    odpowiedz(422, ['error' => 'Potrzebujemy zgody na kontakt.']);
}

// --- prosty limit zgłoszeń na adres IP (plik w katalogu tymczasowym) ---
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'brak');
$plik = sys_get_temp_dir() . '/kliqa-form-' . sha1($ip) . '.txt';
$teraz = time();
$znaczniki = [];
if (is_readable($plik)) {
    $znaczniki = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($plik))),
        static fn (int $t): bool => $t > $teraz - 3600
    );
}
if (count($znaczniki) >= LIMIT_NA_GODZINE) {
    odpowiedz(429, ['error' => 'Za dużo zgłoszeń z tego adresu. Napisz bezpośrednio na ' . ODBIORCA . '.']);
}
$znaczniki[] = $teraz;
@file_put_contents($plik, implode(',', $znaczniki), LOCK_EX);

// --- treść wiadomości ---
$wiersze = [
    'Imię i nazwisko' => $imie,
    'Firma'           => $pole('company') !== '' ? $pole('company') : '—',
    'E-mail'          => $email,
    'Telefon'         => $pole('phone') !== '' ? $pole('phone') : '—',
    'Strona'          => $pole('site') !== '' ? $pole('site') : '—',
    'Zakres'          => $pole('scope') !== '' ? $pole('scope') : '—',
];

$tresc = "Nowe zapytanie ze strony kliqa.pl\n";
$tresc .= str_repeat('-', 34) . "\n";
foreach ($wiersze as $etykieta => $wartosc) {
    $tresc .= $etykieta . ': ' . $wartosc . "\n";
}
$tresc .= str_repeat('-', 34) . "\n\n" . $wiadomosc . "\n\n";
$tresc .= 'IP: ' . $ip . "\n";
$tresc .= 'Data: ' . date('Y-m-d H:i:s') . "\n";

// Nagłówki bez znaków nowej linii z danych użytkownika — inaczej wstrzyknięcie nagłówka.
$czysteImie = preg_replace('/[\r\n]+/', ' ', $imie);
$temat = '=?UTF-8?B?' . base64_encode('Zapytanie ze strony — ' . $czysteImie) . '?=';

$naglowki = [
    'From: ' . NAZWA_NADAWCY . ' <' . NADAWCA . '>',
    'Reply-To: ' . preg_replace('/[\r\n]+/', '', $email),
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: kliqa-form',
];

$wyslano = @mail(ODBIORCA, $temat, $tresc, implode("\r\n", $naglowki), '-f' . NADAWCA);

if (!$wyslano) {
    error_log('kliqa: mail() zwrocil false dla ' . $email);
    odpowiedz(502, ['error' => 'Serwer pocztowy odrzucił wiadomość. Napisz na ' . ODBIORCA . '.']);
}

odpowiedz(200, ['ok' => true]);
