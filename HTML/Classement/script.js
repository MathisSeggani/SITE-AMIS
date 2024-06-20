const apiKey = 'RGAPI-0bcd78b0-b670-4b8b-a1c4-cef8f328c69a'; // Assurez-vous que cette clé est valide
const summonerName = 'V4TSouggo'; // Assurez-vous que ce nom est correct et qu'il n'a pas de caractères spéciaux problématiques
const baseUrl = 'https://api.riotgames.com/lol';

async function getSummonerId(summonerName) {
    const url = `${baseUrl}/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${apiKey}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du summoner:', error);
        throw error;
    }
}

async function getRankedData(summonerId) {
    const url = `${baseUrl}/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de classement:', error);
        throw error;
    }
}

async function displayLeaderboard() {
    try {
        const summonerId = await getSummonerId(summonerName);
        const rankedData = await getRankedData(summonerId);

        const tbody = document.querySelector("#leaderboard tbody");
        if (rankedData.length === 0) {
            showError('Aucune donnée de classement disponible.');
            return;
        }

        rankedData.forEach((entry, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.summonerName}</td>
                <td>${entry.leaguePoints} LP</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données de classement:', error);
        showError(error.message);
    }
}

function showError(message) {
    const tbody = document.querySelector("#leaderboard tbody");
    tbody.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
}

window.onload = displayLeaderboard;
