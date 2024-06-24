document.addEventListener('DOMContentLoaded', async () => {
    const counters = document.querySelectorAll("[id^='counter-']");
    const decreaseButtons = document.querySelectorAll("[id^='decrease-']");
    const increaseButtons = document.querySelectorAll("[id^='increase-']");
    
    let counts = {};

    const fetchCounts = async () => {
        try {
            const response = await fetch('https://6676cf76145714a1bd72dc8a.mockapi.io/spools/amount');
            const data = await response.json();
            data.forEach(item => {
                counts[item.id] = item.amount;
                document.querySelector(`#counter-${item.id}`).textContent = item.amount;
            });
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const updateCountOnServer = async (id, newCount) => {
        try {
            await fetch(`https://6676cf76145714a1bd72dc8a.mockapi.io/spools/amount/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: newCount })
            });
        } catch (error) {
            console.error('Failed to update count:', error);
        }
    };

    const updateCounter = (id) => {
        document.querySelector(`#counter-${id}`).textContent = counts[id];
    };

    decreaseButtons.forEach((button) => {
        const id = button.id.split('-')[1];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            counts[id] -= 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id]);
        });
    });

    increaseButtons.forEach((button) => {
        const id = button.id.split('-')[1];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            counts[id] += 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id]);
        });
    });

    await fetchCounts();
});
