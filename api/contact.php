<?php
declare(strict_types=1);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);

if (!is_array($input)) {
    $input = $_POST;
}

function clean_value(array $input, string $key, string $fallbackKey = ''): string
{
    $value = $input[$key] ?? ($fallbackKey !== '' ? ($input[$fallbackKey] ?? '') : '');
    return trim((string)$value);
}

$honeypot = clean_value($input, 'website');
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$firstName = clean_value($input, 'first_name', 'firstName');
$lastName = clean_value($input, 'last_name', 'lastName');
$email = clean_value($input, 'email');
$organization = clean_value($input, 'organization');
$interest = clean_value($input, 'interest');
$message = clean_value($input, 'message');

if ($firstName === '' || $lastName === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please complete the required fields.']);
    exit;
}

$submission = [
    'id' => bin2hex(random_bytes(16)),
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => $email,
    'organization' => $organization,
    'interest' => $interest,
    'message' => $message,
    'submitted_at' => gmdate('c'),
    'source' => 'website_contact_form',
];

$dataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$stored = file_put_contents(
    $dataDir . DIRECTORY_SEPARATOR . 'contact_submissions.jsonl',
    json_encode($submission, JSON_UNESCAPED_SLASHES) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

if ($stored === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not store submission.']);
    exit;
}

$toEmail = getenv('CONTACT_TO_EMAIL') ?: 'info@lynchpinadvisory.com';
if ($toEmail !== '') {
    $subject = 'New LynchPin website inquiry';
    $body = "Name: {$firstName} {$lastName}\n"
        . "Email: {$email}\n"
        . "Organization: {$organization}\n"
        . "Interest: {$interest}\n\n"
        . $message;
    $headers = "From: no-reply@lynchpinadvisory.com\r\nReply-To: {$email}\r\n";
    @mail($toEmail, $subject, $body, $headers);
}

$webhookUrl = getenv('CONTACT_WEBHOOK_URL') ?: '';
if ($webhookUrl !== '' && function_exists('curl_init')) {
    $ch = curl_init($webhookUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($submission, JSON_UNESCAPED_SLASHES),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

http_response_code(201);
echo json_encode(['ok' => true]);
