function transformData(data) {
    return [
        transformFormat(data.limited),
        transformFormat(data.constructed)
    ];
}

function transformFormat(data) {
    return Object.values(data)
        .flatMap(round => round.map(transformMatch))
        .filter(match => match.record !== '');
}

function transformMatch(match) {
    const wins = match.record.split('-');
    return {
        playerOne: match.playerOne,
        playerTwo: match.playerTwo,
        record: match.record,
        playerOneWins: parseInt(wins[0]),
        playerTwoWins: parseInt(wins[1])
    };
}

function getWinner(match) {
    return match.playerOneWins > match.playerTwoWins ? match.playerOne : match.playerTwo;
}

function calculateMatchWinPercentage(player, matches) {
    const playerMatches = matches.filter(match => match.playerOne === player || match.playerTwo === player);
    const wins = playerMatches.filter(match => getWinner(match) === player).length;
    return wins / playerMatches.length;
}

function calculateOpponentMatchWinPercentage(player, matches) {
    const opponents = matches.filter(match => match.playerOne === player).map(match => match.playerTwo)
        .concat(matches.filter(match => match.playerTwo === player).map(match => match.playerOne));
    return opponents.reduce((acc, opponent) => acc + Math.max(1 / 3, calculateMatchWinPercentage(opponent, matches)), 0) / opponents.length;
}

function calculateGameWinPercentage(player, matches) {
    const playerMatches = matches.filter(match => match.playerOne === player || match.playerTwo === player);
    const wins = playerMatches.reduce((acc, match) => acc + (match.playerOne === player ? match.playerOneWins : match.playerTwoWins), 0);
    const total = playerMatches.reduce((acc, match) => acc + match.playerOneWins + match.playerTwoWins, 0);
    return wins / total;
}

function calculateOpponentGameWinPercentage(player, matches) {
    const opponents = matches.filter(match => match.playerOne === player).map(match => match.playerTwo)
        .concat(matches.filter(match => match.playerTwo === player).map(match => match.playerOne));
    return opponents.reduce((acc, opponent) => acc + Math.max(1 / 3, calculateGameWinPercentage(opponent, matches)), 0) / opponents.length;
}

function calculateMatchRecord(player, matches) {
    const playerMatches = matches.filter(match => match.playerOne === player || match.playerTwo === player);
    const wins = playerMatches.filter(match => getWinner(match) === player).length;
    return [wins, playerMatches.length - wins];
}

function calculateGameRecord(player, matches) {
    const playerMatches = matches.filter(match => match.playerOne === player || match.playerTwo === player);
    const wins = playerMatches.reduce((acc, match) => acc + (match.playerOne === player ? match.playerOneWins : match.playerTwoWins), 0);
    const total = playerMatches.reduce((acc, match) => acc + match.playerOneWins + match.playerTwoWins, 0);
    return [wins, total - wins];
}

function calculatePlayerData(matches) {
    const players = Array.from(new Set(matches.map(match => match.playerOne).concat(matches.map(match => match.playerTwo))));
    return players.map(player => {
        const mwp = calculateMatchWinPercentage(player, matches);
        const omp = calculateOpponentMatchWinPercentage(player, matches);
        const gwp = calculateGameWinPercentage(player, matches);
        const ogp = calculateOpponentGameWinPercentage(player, matches);
        const matchRecord = calculateMatchRecord(player, matches);
        const gameRecord = calculateGameRecord(player, matches);
        return { player, mwp, omp, gwp, ogp, matchRecord, gameRecord };
    });
}

function combinePlayers(a, b) {
    return {
        player: a.player,
        mwp: (a.mwp + b.mwp) / 2,
        omp: (a.omp + b.omp) / 2,
        gwp: (a.gwp + b.gwp) / 2,
        ogp: (a.ogp + b.ogp) / 2,
        matchRecord: [a.matchRecord[0] + b.matchRecord[0], a.matchRecord[1] + b.matchRecord[1]],
        gameRecord: [a.gameRecord[0] + b.gameRecord[0], a.gameRecord[1] + b.gameRecord[1]]
    };
}

function sortPlayers(playerData) {
    return playerData.sort((a, b) => {
        if (a.mwp !== b.mwp) {
            return b.mwp - a.mwp;
        }
        if (a.omp !== b.omp) {
            return b.omp - a.omp;
        }
        if (a.gwp !== b.gwp) {
            return b.gwp - a.gwp;
        }
        if (a.ogp !== b.ogp) {
            return b.ogp - a.ogp;
        }

        return a.player.localeCompare(b.player);
    });
}

function combineFormatData(limitedPlayerData, constructedPlayerData) {
    const players = Array.from(new Set(limitedPlayerData.map(x => x.player).concat(constructedPlayerData.map(x => x.player))));

    const combinedPlayerData = [];
    for (const player of players) {
        const limitedPlayer = limitedPlayerData.find(x => x.player === player);
        const constructedPlayer = constructedPlayerData.find(x => x.player === player);
        if (limitedPlayerData === undefined || constructedPlayerData === undefined) {
            combinedPlayerData.push(limitedPlayer || constructedPlayer);
        } else {
            combinedPlayerData.push(combinePlayers(limitedPlayer, constructedPlayer));
        }
    }
    return combinedPlayerData;
}

function computePotentialOutcomes(rawData) {
    const [limited, constructed] = transformData(rawData);
    const unplayedMatches = rawData.constructed["Round 3"].filter(match => match.record === "");
    for (let i = 0; i < Math.pow(2, unplayedMatches.length); i++) {
        const playedMatches = unplayedMatches.map((match, index) => {
            const record = (i & (1 << index)) ? "2-0" : "0-2";
            return { ...match, record };
        });

        console.log(`Scenario ${i + 1}: ${playedMatches.map(x => `${x.playerOne} vs ${x.playerTwo} (${x.record})`).join(', ')}`)

        const combined = constructed.concat(playedMatches.map(transformMatch));
        const constructedPlayerData = calculatePlayerData(combined);
        const limitedPlayerData = calculatePlayerData(limited);

        const combinedPlayerData = combineFormatData(limitedPlayerData, constructedPlayerData);

        const sortedPlayers = sortPlayers(combinedPlayerData);
        console.log(sortedPlayers.map(x => x.player).slice(0, 4));
    }
}
