document.addEventListener('DOMContentLoaded', async () => {
    const counters = document.querySelectorAll("[id^='counter-']");
    const decreaseButtons = document.querySelectorAll("[id^='decrease-']");
    const increaseButtons = document.querySelectorAll("[id^='increase-']");

    const needCounters = document.querySelectorAll("[id^='need-counter-']");
    const needDecreaseButtons = document.querySelectorAll("[id^='need-decrease-']");
    const needIncreaseButtons = document.querySelectorAll("[id^='need-increase-']");

    let counts = {};
    let needs = {};

    const fetchCounts = async () => {
        try {
            const response = await fetch('https://6676cf76145714a1bd72dc8a.mockapi.io/spools/amount');
            const data = await response.json();
            data.forEach(item => {
                counts[item.id] = item.amount;
                needs[item.id] = item.need;
                document.querySelector(`#counter-${item.id}`).textContent = item.amount;
                document.querySelector(`#need-counter-${item.id}`).textContent = item.need;
            });
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const updateCountOnServer = async (id, newCount, newNeed) => {
        try {
            await fetch(`https://6676cf76145714a1bd72dc8a.mockapi.io/spools/amount/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: newCount, need: newNeed })
            });
        } catch (error) {
            console.error('Failed to update count:', error);
        }
    };

    const updateCounter = (id) => {
        document.querySelector(`#counter-${id}`).textContent = counts[id];
        document.querySelector(`#need-counter-${id}`).textContent = needs[id];
    };

    decreaseButtons.forEach((button) => {
        const id = button.id.split('-')[1];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            counts[id] -= 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id], needs[id]);
        });
    });

    increaseButtons.forEach((button) => {
        const id = button.id.split('-')[1];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            counts[id] += 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id], needs[id]);
        });
    });

    needDecreaseButtons.forEach((button) => {
        const id = button.id.split('-')[2];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            needs[id] -= 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id], needs[id]);
        });
    });

    needIncreaseButtons.forEach((button) => {
        const id = button.id.split('-')[2];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            needs[id] += 1;
            updateCounter(id);
            await updateCountOnServer(id, counts[id], needs[id]);
        });
    });

    await fetchCounts();
});
