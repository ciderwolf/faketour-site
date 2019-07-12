<?php
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    require($_SERVER['DOCUMENT_ROOT'] . "/php/env.php");
    require($_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php");
    use \Mailjet\Resources;
    $mj = new \Mailjet\Client($MALJET_PUBLIC_KEY, $MALJET_PRIVATE_KEY, true, ['version' => 'v3.1']);

    $email = $_REQUEST["email"];
    $result = $conn->query("SELECT username, password FROM users WHERE email='$email'");
    $username = "";
    $password = "";
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $username = $row["username"];
        $password = $row["password"];
    } else {
        die("no email");
    }
    $random_bytes = bin2hex(openssl_random_pseudo_bytes(4));
    $result = $conn->query("UPDATE users SET email_code='$random_bytes' WHERE username='$username'");
    if ($result === false) {
        die("failed to generate url");
    }

    $hash = md5($random_bytes . $password);
    $url = "http://faketour.22web.org/account/password/reset/?token=$hash&user=$username";
    
    
    $email_text = "Hi $username,\n\nJust one more step to finish resetting your password. Please use the link below to continue the process. If you did not attempt to reset your password, please disregard this email.\n\n";
    $body = [
        'Messages' => [
            [
                'From' => [
                    'Email' => "faketour.help@gmail.com",
                    'Name' => "Faketour Support"
                ],
                'To' => [
                    [
                        'Email' => $email,
                        'Name' => $username
                    ]
                ],
                'Subject' => "Password Reset Link",
                'TextPart' => $email_text . $url,
                'HTMLPart' => "<p>" . nl2br($email_text) . "</p><a href=$url>$url</a>"
            ]
        ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
    if($response->success()) {
        echo "true";
    } else {
        echo "failed to send email";
    }
?>