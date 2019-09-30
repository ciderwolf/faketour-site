<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* template.html */
class __TwigTemplate_1f35174bf75baf8e3002737e9cffcae2439bae6ad686c4f239e7d803ab321e18 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "
<html>
    <head>
        <title>";
        // line 4
        echo twig_upper_filter($this->env, (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 4)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[0] ?? null) : null));
        echo " - About | Faketour</title>
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
        <link href=\"https://fonts.googleapis.com/css?family=Nunito\" rel=\"stylesheet\">
        <link rel=\"stylesheet\" href=\"../template/about.css\">
        <style rel=\"text/css\">
            .content:before {
                background-image: linear-gradient( rgba(0, 0, 0, ";
        // line 10
        echo twig_get_attribute($this->env, $this->source, ($context["style"] ?? null), "shadow", [], "any", false, false, false, 10);
        echo "), rgba(0, 0, 0, ";
        echo twig_get_attribute($this->env, $this->source, ($context["style"] ?? null), "shadow", [], "any", false, false, false, 10);
        echo ") ), url(\"bg_splash.jpg\");
            }
            :root {
                --bg-color: ";
        // line 13
        echo twig_get_attribute($this->env, $this->source, ($context["style"] ?? null), "bgcolor", [], "any", false, false, false, 13);
        echo ";
            }
        </style>
        <script type=\"text/javascript\" src=\"/menu/loadMenu.js\"></script>
        <link rel=\"stylesheet\" href=\"/menu/styles.css\">
        <link rel=\"stylesheet\" href=\"/css/keyrune/css/keyrune.css\">
    </head>
    <body>
        <div class=\"content\">
        <div class=\"topnav\"></div>
        <script type=\"text/javascript\">loadMenu(\"About ";
        // line 23
        echo twig_upper_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 23)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144[0] ?? null) : null));
        echo "\");</script>
        <h1>FakeTour</h1>
        <img ";
        // line 25
        if ((twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "logo_gap", [], "any", false, false, false, 25) == false)) {
            echo " class='top-gap' ";
        }
        echo " src=\"";
        echo (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 25)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b[0] ?? null) : null);
        echo "-logo.png\"/>
        <div id=\"bg\">
            ";
        // line 27
        if (twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "constructed", [], "any", false, false, false, 27)) {
            // line 28
            echo "                <h2>";
            echo twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "constructed", [], "any", false, false, false, 28), "name", [], "any", false, false, false, 28);
            echo "</h2>
                <p>";
            // line 29
            echo twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "constructed", [], "any", false, false, false, 29), "description", [], "any", false, false, false, 29);
            echo "</p>
            ";
        } else {
            // line 31
            echo "             <h2>Standard</h2>
             <p>Submit a deck made up of cards from the following sets:
                ";
            // line 33
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 33));
            foreach ($context['_seq'] as $context["_key"] => $context["code"]) {
                // line 34
                echo "                    <i class=\"ss ss-";
                echo $context["code"];
                echo "\"></i>&ensp;
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['code'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 36
            echo "                <br><a class=\"underlight\" href=\"https://scryfall.com/search?q=%28set%3A";
            echo twig_join_filter(twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 36), "+OR+set%3A");
            echo "%29&unique=cards&as=grid&order=name\">
                    <i>(";
            // line 37
            echo twig_join_filter(twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "names", [], "any", false, false, false, 37), ", ");
            echo ")</i>
                </a>
            </p> 
            ";
        }
        // line 41
        echo "            ";
        if (twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "limited", [], "any", false, false, false, 41)) {
            // line 42
            echo "                <h2>";
            echo twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "limited", [], "any", false, false, false, 42), "name", [], "any", false, false, false, 42);
            echo "</h2>
                <p>";
            // line 43
            echo twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, ($context["format"] ?? null), "limited", [], "any", false, false, false, 43), "description", [], "any", false, false, false, 43);
            echo "</p>
            ";
        } else {
            // line 45
            echo "            <h2>Draft</h2>
            <p>Draft 3 packs of ";
            // line 46
            echo (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "names", [], "any", false, false, false, 46)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002[0] ?? null) : null);
            echo ".
                <a class=\"underlight\" href=\"https://scryfall.com/sets/";
            // line 47
            echo (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 47)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4[0] ?? null) : null);
            echo "?as=grid&order=name\"><i>View the set spoiler</i></a>
            </p>
            ";
        }
        // line 50
        echo "            <div style=\"display: flex; justify-content: center\">
                <a id=\"button\" href=\"/constructed/\"><button class=\"bold light\">Submit Constructed Deck</button></a>
            </div>
        </div>
        <div class=\"footer\"><a href='";
        // line 54
        echo twig_get_attribute($this->env, $this->source, ($context["artist"] ?? null), "url", [], "any", false, false, false, 54);
        echo "'>Artwork by <br/>";
        echo twig_get_attribute($this->env, $this->source, ($context["artist"] ?? null), "name", [], "any", false, false, false, 54);
        echo "</a></div>
    </body>
    <script>
        const buttonMapping = {
            0: {
                name: \"Login to Register\",
                href: \"/account/login/\"
            },
            1: {
                name: \"View Results\",
                href: \"results/\",
            },
            2: {
                name: \"Register\",
                href: \"/events/\"
            },
            3: {
                name: \"Matches\",
                href: \"/matches/\"
            }
        }
        fetch('/event.php?set=";
        // line 75
        echo (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = twig_get_attribute($this->env, $this->source, ($context["sets"] ?? null), "codes", [], "any", false, false, false, 75)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666[0] ?? null) : null);
        echo "&login=false')
        .then(response => response.text())
        .then(response => {
            const code = Number(response);
            let target = buttonMapping[code];
            let button = document.getElementById(\"button\");
            button.firstChild.innerHTML = target.name;
            button.href = target.href;
        });
    </script>
</html>";
    }

    public function getTemplateName()
    {
        return "template.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  185 => 75,  159 => 54,  153 => 50,  147 => 47,  143 => 46,  140 => 45,  135 => 43,  130 => 42,  127 => 41,  120 => 37,  115 => 36,  106 => 34,  102 => 33,  98 => 31,  93 => 29,  88 => 28,  86 => 27,  77 => 25,  72 => 23,  59 => 13,  51 => 10,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("
<html>
    <head>
        <title>{{ sets.codes[0]|upper }} - About | Faketour</title>
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
        <link href=\"https://fonts.googleapis.com/css?family=Nunito\" rel=\"stylesheet\">
        <link rel=\"stylesheet\" href=\"../template/about.css\">
        <style rel=\"text/css\">
            .content:before {
                background-image: linear-gradient( rgba(0, 0, 0, {{ style.shadow }}), rgba(0, 0, 0, {{ style.shadow }}) ), url(\"bg_splash.jpg\");
            }
            :root {
                --bg-color: {{ style.bgcolor }};
            }
        </style>
        <script type=\"text/javascript\" src=\"/menu/loadMenu.js\"></script>
        <link rel=\"stylesheet\" href=\"/menu/styles.css\">
        <link rel=\"stylesheet\" href=\"/css/keyrune/css/keyrune.css\">
    </head>
    <body>
        <div class=\"content\">
        <div class=\"topnav\"></div>
        <script type=\"text/javascript\">loadMenu(\"About {{ sets.codes[0]|upper }}\");</script>
        <h1>FakeTour</h1>
        <img {% if sets.logo_gap == false %} class='top-gap' {% endif %} src=\"{{ sets.codes[0] }}-logo.png\"/>
        <div id=\"bg\">
            {% if format.constructed %}
                <h2>{{ format.constructed.name }}</h2>
                <p>{{ format.constructed.description }}</p>
            {% else %}
             <h2>Standard</h2>
             <p>Submit a deck made up of cards from the following sets:
                {% for code in sets.codes %}
                    <i class=\"ss ss-{{ code }}\"></i>&ensp;
                {% endfor%}
                <br><a class=\"underlight\" href=\"https://scryfall.com/search?q=%28set%3A{{ sets.codes|join('+OR+set%3A') }}%29&unique=cards&as=grid&order=name\">
                    <i>({{ sets.names|join(\", \") }})</i>
                </a>
            </p> 
            {% endif %}
            {% if format.limited %}
                <h2>{{ format.limited.name }}</h2>
                <p>{{ format.limited.description }}</p>
            {% else %}
            <h2>Draft</h2>
            <p>Draft 3 packs of {{ sets.names[0] }}.
                <a class=\"underlight\" href=\"https://scryfall.com/sets/{{ sets.codes[0] }}?as=grid&order=name\"><i>View the set spoiler</i></a>
            </p>
            {% endif %}
            <div style=\"display: flex; justify-content: center\">
                <a id=\"button\" href=\"/constructed/\"><button class=\"bold light\">Submit Constructed Deck</button></a>
            </div>
        </div>
        <div class=\"footer\"><a href='{{ artist.url }}'>Artwork by <br/>{{ artist.name }}</a></div>
    </body>
    <script>
        const buttonMapping = {
            0: {
                name: \"Login to Register\",
                href: \"/account/login/\"
            },
            1: {
                name: \"View Results\",
                href: \"results/\",
            },
            2: {
                name: \"Register\",
                href: \"/events/\"
            },
            3: {
                name: \"Matches\",
                href: \"/matches/\"
            }
        }
        fetch('/event.php?set={{ sets.codes[0] }}&login=false')
        .then(response => response.text())
        .then(response => {
            const code = Number(response);
            let target = buttonMapping[code];
            let button = document.getElementById(\"button\");
            button.firstChild.innerHTML = target.name;
            button.href = target.href;
        });
    </script>
</html>", "template.html", "/Users/bsiderowf/Sites/faketour/about/template/template.html");
    }
}
