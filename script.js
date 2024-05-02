let myBarChart; 
let myDoughnutChart; 

function generarDatos() {
    const sampleSize = parseInt(document.getElementById("sampleSize").value);
    const sampleData = generarDatosAleatorios(sampleSize);
    renderizarGraficoBarras(sampleData);
    renderizarGraficoDonut(sampleData);
    const tStatistic = calcularPruebaTStudent(sampleData);
    const alpha = 0.05;
    const gradosLibertad = sampleSize - 1;
    const valorCritico = obtenerValorCriticoTStudent(alpha, gradosLibertad);
    mostrarResultadoHipotesis(tStatistic, valorCritico);
}
function calcularPruebaTStudent(sampleData) {
    const media = sampleData.reduce((acc, value) => acc + value, 0) / sampleData.length;
    const desviacionEstandar = Math.sqrt(sampleData.map(value => Math.pow(value - media, 2)).reduce((acc, value) => acc + value, 0) / (sampleData.length - 1));
    const mediaHipotesis = 30; 
    const tStatistic = (media - mediaHipotesis) / (desviacionEstandar / Math.sqrt(sampleData.length));
    return tStatistic;
}


function generarDatosAleatorios(sampleSize) {
    const sampleData = [];
    for (let i = 0; i < sampleSize; i++) {  
        const randomValue = Math.floor(Math.random() * 21) + 20;
        sampleData.push(randomValue);
    }
    return sampleData;
}

function renderizarGraficoBarras(data) {
    const ctx = document.getElementById('myBarChart').getContext('2d');
    if (myBarChart) {
        myBarChart.destroy();
    }
    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map((value, index) => `Grupo ${index + 1}`),
            datasets: [{
                label: 'Muestra',
                data: data,
                backgroundColor: 'rgba(63, 40, 235, 0.5)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderizarGraficoDonut(data) {
    const ctx = document.getElementById('myDoughnutChart').getContext('2d');
    if (myDoughnutChart) {
        myDoughnutChart.destroy();
    }
    const totalSum = data.reduce((sum, value) => sum + value, 0);
    myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map((value, index) => `Grupo ${index + 1}`),
            datasets: [{
                label: 'Muestra',
                data: data,
                backgroundColor: data.map(() => getRandomColor()) 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const dataset = tooltipItem.dataset;
                            const total = dataset.data.reduce((acc, val) => acc + val, 0);
                            const value = dataset.data[tooltipItem.dataIndex];
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${dataset.label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}

function mostrarResultadoHipotesis(tStatistic, valorCritico) {
    const resultElement = document.getElementById("resultadoHipotesis");
    if (Math.abs(tStatistic) > valorCritico) {
        resultElement.textContent = "Resultado de la prueba de hipótesis: Se rechaza la hipótesis nula";
        resultElement.style.color = "red";
    } else {
        resultElement.textContent = "Resultado de la prueba de hipótesis: No se rechaza la hipótesis nula";
        resultElement.style.color = "green";
    }
}

function obtenerValorCriticoTStudent(alpha, gradosLibertad) {
    return 1.96; 
}

function getRandomColor() {
    return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
}
