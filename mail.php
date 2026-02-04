<?php
// Set internal encoding
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// Redirect URL
$redirect_url = 'contact_complete.html';

// Admin Email Address (Change this to your actual email)
$admin_email = "admin@example.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and Retrieve inputs
    $inquiry_type = isset($_POST['inquiry_type']) ? $_POST['inquiry_type'] : '';
    $message_content = isset($_POST['message']) ? $_POST['message'] : '';
    $company = isset($_POST['company']) ? $_POST['company'] : '';
    $department = isset($_POST['department']) ? $_POST['department'] : '';
    
    // Name
    $name_family = isset($_POST['name_family']) ? $_POST['name_family'] : '';
    $name_given = isset($_POST['name_given']) ? $_POST['name_given'] : '';
    $full_name = $name_family . ' ' . $name_given;
    
    // Furigana
    $kana_family = isset($_POST['kana_family']) ? $_POST['kana_family'] : '';
    $kana_given = isset($_POST['kana_given']) ? $_POST['kana_given'] : '';
    $full_kana = $kana_family . ' ' . $kana_given;
    
    $zip = isset($_POST['zip']) ? $_POST['zip'] : '';
    $address = isset($_POST['address']) ? $_POST['address'] : '';
    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';

    // Map Inquiry Type values to Japanese
    $type_map = [
        'company' => '会社・事業について',
        'ir' => 'IR情報について',
        'recruit' => '人事・採用窓口について',
        'pr' => 'PR・広告関連のご連絡',
        'property' => '物件紹介',
        'other' => 'その他'
    ];
    $inquiry_type_text = isset($type_map[$inquiry_type]) ? $type_map[$inquiry_type] : $inquiry_type;

    // --- 1. Email to Admin ---
    $admin_subject = "【ホームページよりお問い合わせ】" . $full_name . "様";
    $admin_body = <<<EOD
ホームページのお問い合わせフォームより、以下の内容でのお問い合わせがありました。

[お問い合わせ日時] 
{date('Y-m-d H:i:s')}

[お問い合わせ件名]
{$inquiry_type_text}

[お問い合わせ内容]
{$message_content}

[会社名・団体名]
{$company}

[部署名]
{$department}

[お名前]
{$full_name} ({$full_kana})

[郵便番号]
{$zip}

[ご住所]
{$address}

[電話番号]
{$phone}

[メールアドレス]
{$email}

--------------------------------------------------
ITL JAPAN株式会社
EOD;

    // Headers
    $admin_headers = "From: " . mb_encode_mimeheader("ITL JAPAN Web Form") . " <no-reply@itljapan.co.jp>\r\n";
    $admin_headers .= "Reply-To: " . $email . "\r\n";
    $admin_headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send to Admin
    mb_send_mail($admin_email, $admin_subject, $admin_body, $admin_headers);


    // --- 2. Auto-reply Email to User ---
    $user_subject = "【ITL JAPAN株式会社】お問い合わせありがとうございます";
    $user_body = <<<EOD
{$full_name} 様

この度は、ITL JAPAN株式会社へお問い合わせいただき誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。

担当者より確認次第、折り返しご連絡させていただきます。
今しばらくお待ちいただけますようお願い申し上げます。

--------------------------------------------------
[お問い合わせ内容]
{$message_content}

[お問い合わせ件名]
{$inquiry_type_text}
--------------------------------------------------

※本メールは自動送信によりお届けしております。
※お心当たりがない場合は、お手数ですが本メールを削除してください。

--------------------------------------------------
ITL JAPAN株式会社
〒106-0047 東京都港区南麻布2-11-10 OJビル7F
TEL: 03-5439-9009
URL: https://itljapan.co.jp/
--------------------------------------------------
EOD;

    // Headers
    $user_headers = "From: " . mb_encode_mimeheader("ITL JAPAN株式会社") . " <no-reply@itljapan.co.jp>\r\n";
    $user_headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send to User
    mb_send_mail($email, $user_subject, $user_body, $user_headers);

    // Redirect to success page
    header("Location: " . $redirect_url);
    exit;
}
?>
