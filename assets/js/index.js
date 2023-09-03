let button = document.querySelector("#convert-button");
let resultSpan = document.querySelector("#result");
let inputField = document.getElementById("exchange");

async function getCurrency() {
    try {
        let res = await fetch("https://mindicador.cl/api/");
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        return null;
    }
}

async function updateCurrencyConversion() {
    try {
        let currencyData = await getCurrency();
        if (currencyData) {
            let selectedCurrency = document.getElementById("currency").value;
            let currencyInfo = currencyData[selectedCurrency];
            if (currencyInfo) {
                let inputValue = parseFloat(inputField.value);
                let exchangeRate = currencyInfo.valor;
                let resultValue = inputValue / exchangeRate;
                resultSpan.textContent = `${inputValue} CLP = ${resultValue.toFixed(2)} ${currencyInfo.nombre}`;
            } else {
                resultSpan.textContent = "Tipo de cambio no encontrado";
            }
        } else {
            console.error("Error: No se pudieron obtener los datos de la API.");
        }
    } catch (error) {
        console.error("Error buscando la data:", error);
    }
}

button.addEventListener("click", updateCurrencyConversion);



async function getDataforChart(endpoint1, endpoint2) {
    try {
        const apiUrl = `https://mindicador.cl/api/${endpoint1}`;
        let res = await fetch(apiUrl);
        let data = await res.json();
        let labels = data.serie.slice(0, 10).map(entry => entry[endpoint2].split('T')[0]);
        let values = data.serie.slice(0, 10).map(entry => entry.valor);

        let ctx = document.getElementById('myChart').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial de los últimos 10 valores de ${endpoint1}`,
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1 
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}


async function renderGrafica(currencyCode) {
    try {
        if (currencyCode === "dolar") {
            await getDataforChart("dolar", "fecha");
        } else if (currencyCode === "euro") {
            await getDataforChart("euro", "fecha");
        } else {
            console.error("Invalid currency code");
        }
    } catch (error) {
        console.error(error);
    }
}

button.addEventListener("click", () => {
    const selectedCurrency = document.getElementById("currency").value;
    renderGrafica(selectedCurrency);
});






