<?php
    require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
    $loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/about/template/");
    $twig = new \Twig\Environment($loader, [
        'cache' => $_SERVER["DOCUMENT_ROOT"] . "/template_cache",
        'autoescape' => false,
        'debug' => true
    ]);

    $template = $twig->load("template.html");

    $context = json_decode(file_get_contents("context.json"), true);
    echo $template->render($context);
?>