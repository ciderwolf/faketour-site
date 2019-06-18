CREATE TABLE mh1_players (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    deck VARCHAR(3000),
    reg_date TIMESTAMP
);

CREATE TABLE mh1_matches (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    format VARCHAR(30) NOT NULL,
    round VARCHAR(30) NOT NULL,
    games INT(11) DEFAULT 3,
    player_one VARCHAR(30) NOT NULL,
    player_two VARCHAR(30) NOT NULL,
    score VARCHAR(3000),
    reg_date TIMESTAMP
)