<?php
// Set language and encoding
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// Configuration
$to_admin = "nobuyuki.miyagawa14@gmail.com";
$subject_admin = "【株式会社ヨナタン】お問い合わせがありました";


// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and Retrieve Data
    $inquiry_type = htmlspecialchars($_POST['inquiry_type'] ?? '', ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');
    $company = htmlspecialchars($_POST['company'] ?? '', ENT_QUOTES, 'UTF-8');
    $department = htmlspecialchars($_POST['department'] ?? '', ENT_QUOTES, 'UTF-8');

    $name_family = htmlspecialchars($_POST['name_family'] ?? '', ENT_QUOTES, 'UTF-8');
    $name_given = htmlspecialchars($_POST['name_given'] ?? '', ENT_QUOTES, 'UTF-8');
    $name_full = $name_family . ' ' . $name_given;

    $kana_family = htmlspecialchars($_POST['kana_family'] ?? '', ENT_QUOTES, 'UTF-8');
    $kana_given = htmlspecialchars($_POST['kana_given'] ?? '', ENT_QUOTES, 'UTF-8');
    $kana_full = $kana_family . ' ' . $kana_given;

    $zip = htmlspecialchars($_POST['zip'] ?? '', ENT_QUOTES, 'UTF-8');
    $address = htmlspecialchars($_POST['address'] ?? '', ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($_POST['phone'] ?? '', ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
    $email_confirm = htmlspecialchars($_POST['email_confirm'] ?? '', ENT_QUOTES, 'UTF-8');

    // Basic Validation (Server-side)
    if (empty($email) || $email !== $email_confirm) {
        // Handle error - normally you'd show an error message. 
        // For simplicity, we redirect back or show error.
        echo "メールアドレスが一致しません。";
        exit;
    }

    // --- Content for Admin Email ---
    $body_admin = <<<EOD
以下の内容でお問い合わせがありました。

【お問い合わせ内容】
件名：{$inquiry_type}
内容：
{$message}

【お客様情報】
会社名：{$company}
部署名：{$department}
氏名：{$name_full} ({$kana_full})
住所：〒{$zip} {$address}
電話番号：{$phone}
メールアドレス：{$email}

--------------------------------------------------
送信日時：2026-02-03
EOD;



    // Send Email to Admin
    $headers_admin = "From: {$email}";
    mb_send_mail($to_admin, $subject_admin, $body_admin, $headers_admin);



    // Redirect to Complete Page
    header("Location: contact_complete.html");
    exit;

} else {
    // If accessed directly without POST
    header("Location: contact.html");
    exit;
}
?>