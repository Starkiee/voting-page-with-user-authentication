document.addEventListener('DOMContentLoaded', function () {

    function getCurrentUsername() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '../php/check-login.php', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.loggedIn) {
                        resolve(response.username);
                    } else {
                        resolve(null);
                    }
                }
            };

            xhr.send();
        });
    }

    function logout() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../php/logout.php", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                window.location.href = 'index.html';
            }
        };

        xhr.send();
    }

    function vote(animeId) {
        const votedAnime = localStorage.getItem('votedAnime');
        if (votedAnime) {
            alert('You have already voted. Only one vote is allowed.');
            return;
        }

        getCurrentUsername().then(username => {
            if (username) {
                const totalVotes = parseInt(localStorage.getItem('totalVotes')) || 0;
                const animeVotes = parseInt(localStorage.getItem(animeId)) || 0;

                localStorage.setItem(animeId, animeVotes + 1);
                localStorage.setItem('totalVotes', totalVotes + 1);

                const progress = (animeVotes + 1) / (totalVotes + 1) * 100;
                document.getElementById(`progress-${animeId}`).style.width = `${progress}%`;

                localStorage.setItem('votedAnime', animeId);

                const dbPromise = idb.openDB('votingDB', 1, {
                    upgrade(db) {
                        db.createObjectStore('userVotes', { keyPath: 'username' });
                        db.createObjectStore('animeVotes', { keyPath: 'animeId' });
                        db.createObjectStore('totalVotes', { keyPath: 'id' });
                    },
                });

                dbPromise.then(db => {
                    const tx = db.transaction(['userVotes', 'animeVotes', 'totalVotes'], 'readwrite');
                    const userVotesStore = tx.objectStore('userVotes');
                    const animeVotesStore = tx.objectStore('animeVotes');
                    const totalVotesStore = tx.objectStore('totalVotes');

                    userVotesStore.get(username).then(existingVote => {
                        if (existingVote) {
                            alert('You have already voted. Only one vote is allowed.');
                            return;
                        }

                        userVotesStore.put({ username, animeId });

                        animeVotesStore.get(animeId).then(existingAnimeVotes => {
                            const newAnimeVotes = existingAnimeVotes ? existingAnimeVotes.votes + 1 : 1;
                            animeVotesStore.put({ animeId, votes: newAnimeVotes });

                            totalVotesStore.get(1).then(existingTotalVotes => {
                                const newTotalVotes = existingTotalVotes ? existingTotalVotes.total + 1 : 1;
                                totalVotesStore.put({ id: 1, total: newTotalVotes });

                                updateProgressBar(animeId, newAnimeVotes, newTotalVotes);

                                localStorage.setItem('votedAnime', animeId);

                                const voteButtons = document.querySelectorAll('.vote-btn');
                                voteButtons.forEach(button => button.disabled = true);
                            });
                        });
                    });

                    return tx.complete;
                });

            } else {
                alert('You need to be logged in to vote.');
            }
        });
    }

    function updateProgressBar(animeId, animeVotes, totalVotes) {
        const progress = (animeVotes / totalVotes) * 100;
        document.getElementById(`progress-${animeId}`).style.width = `${progress}%`;
    }

    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => button.disabled = true);
});