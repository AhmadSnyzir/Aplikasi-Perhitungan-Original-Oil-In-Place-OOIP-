document.getElementById("calculation-method").addEventListener("change", (event) => {
    const method = event.target.value;
    document.getElementById("volume-inputs").classList.toggle("hidden", method !== "volume");
    document.getElementById("area-thickness-inputs").classList.toggle("hidden", method !== "area-thickness");
});

document.getElementById("calculate-btn").addEventListener("click", () => {
    // Ambil nilai input
    const calculationMethod = document.getElementById("calculation-method").value;
    let volumeReservoir = null;
    let area = null;
    let thickness = null;

    if (calculationMethod === "volume") {
        volumeReservoir = parseFloat(document.getElementById("volume").value);
    } else if (calculationMethod === "area-thickness") {
        area = parseFloat(document.getElementById("area").value);
        thickness = parseFloat(document.getElementById("thickness").value);
        if (!isNaN(area) && !isNaN(thickness)) {
            volumeReservoir = area * thickness;
        }
    }

    const porosity = parseFloat(document.getElementById("porosity").value);
    const oilSaturation = parseFloat(document.getElementById("oil-saturation").value);
    const formationFactor = parseFloat(document.getElementById("formation-factor").value);

    // Validasi input
    if (
        isNaN(volumeReservoir) || volumeReservoir <= 0 ||
        isNaN(porosity) || porosity <= 0 || porosity > 1 ||
        isNaN(oilSaturation) || oilSaturation < 0 || oilSaturation > 1 ||
        isNaN(formationFactor) || formationFactor <= 0
    ) {
        alert("Please provide valid inputs.");
        return;
    }

    // Perhitungan OOIP
    const so = oilSaturation; // Peralihan dari Saturasi air menjadi saturasi Minyak sesuai rumus yang diterapkan
    const ooip = (7758 * porosity * so * volumeReservoir) / formationFactor;

    // Tampilkan hasil
    document.getElementById("ooip-result").textContent =
        "OOIP: " + ooip.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " STB";

    // Render grafik
    renderChart(area, thickness, volumeReservoir, ooip);
});

// Fungsi untuk menampilkan grafik
function renderChart(area, thickness, volumeReservoir, ooip) {
    const canvas = document.getElementById("ooip-chart");
    const ctx = canvas.getContext("2d");

    // Hapus grafik sebelumnya (jika ada)
    if (window.currentChart) {
        window.currentChart.destroy();
    }

    // Buat grafik baru
    window.currentChart = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
            labels: ['Volume Reservoir (acre-ft)', 'OOIP (STB)'],
            datasets: [
                {
                    label: 'Values(LineChart)',
                    data: [volumeReservoir, ooip],
                    backgroundColor: 'rgba(72, 187, 120, 0.2)',
                    borderColor: '#2b6cb0',
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true },
                x: { title: { display: true, text: 'Parameters' } }
            }
        }
    });
}