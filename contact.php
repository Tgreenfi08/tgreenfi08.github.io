<?php
declare(strict_types=1);

function redirect_with_status(string $status): void
{
    header('Location: contact.html?status=' . urlencode($status));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('invalid-method');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? 'Website Contact'));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('invalid-input');
}

$to = 'tgreen@tdmss.com';

$cleanSubject = preg_replace('/[\r\n]+/', ' ', $subject);
if ($cleanSubject === null || $cleanSubject === '') {
    $cleanSubject = 'Website Contact';
}

$bodyLines = [
    'Name: ' . $name,
    'Email: ' . $email,
];

if ($phone !== '') {
    $bodyLines[] = 'Phone: ' . $phone;
}

$bodyLines[] = '';
$bodyLines[] = 'Message:';
$bodyLines[] = $message;

$body = implode("\n", $bodyLines);
$headers = [
    'From: tgreen@tdmss.com',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $cleanSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    redirect_with_status('send-failed');
}

redirect_with_status('sent');
