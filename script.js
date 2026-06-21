const API =
"https://sheetdb.io/api/v1/yo673ha5gqarc?sheet=Agenda";

async function loadData() {

    try {

        const response = await fetch(API);
        const data = await response.json();

        updateStatistics(data);
        tampilkanWidgetInfo(data);
        tampilkanKategori2026(data);
        tampilkanAgendaHariIni(data);
        tampilkanAgenda365Hari(data);

    } catch (error) {

        console.error(error);

    }
}

function formatTanggal(date){

    return String(date.getDate()).padStart(2,"0")
        + "/"
        + String(date.getMonth()+1).padStart(2,"0")
        + "/"
        + date.getFullYear();

}

function formatTanggalIndonesia(tanggal){

    if(!tanggal) return "-";

    const p =
        tanggal.split("/");

    const bulan = [
        "Jan","Feb","Mar","Apr",
        "Mei","Jun","Jul","Agu",
        "Sep","Okt","Nov","Des"
    ];

    return `${p[0]} ${bulan[parseInt(p[1])-1]} ${p[2]}`;

}

function parseTanggal(tanggal) {

    if (!tanggal) return null;

    const p = tanggal.split("/");

    return new Date(
        p[2],
        p[1] - 1,
        p[0]
    );
}

function updateStatistics(data) {

    // Total Agenda Tahun 2026
    const agenda2026 = data.filter(item => {

        if (!item.Mulai) return false;

        return item.Mulai.split("/")[2] === "2026";

    });

    document.getElementById("totalAgenda").textContent =
        agenda2026.length;


    // Total Agenda Bulan Ini
    const sekarang = new Date();

    const bulanSekarang =
        sekarang.getMonth() + 1;

    const tahunSekarang =
        sekarang.getFullYear();

    const agendaBulanIni =
        data.filter(item => {

            if (!item.Mulai) return false;

            const p =
                item.Mulai.split("/");

            return (
                parseInt(p[1]) === bulanSekarang &&
                parseInt(p[2]) === tahunSekarang
            );

        });

    document.getElementById("agendaBulanIni")
        .textContent =
        agendaBulanIni.length;


    // Personel Hari Ini
    const today =
        formatTanggal(new Date());

    const agendaHariIni =
        data.filter(item =>
            item.Mulai === today
        );

    const personel = new Set();

    agendaHariIni.forEach(item => {

        [
            item.Foto,
            item.Video,
            item.Berita,
            item.Medsos,
            item.Drone,
            item.Desain,
            item["Video Editing"],
            item["Siaran Pers"],
            item.Lainnya
        ].forEach(nama => {

            if (nama && nama.trim() !== "") {

                nama.split(",").forEach(pic => {

                    personel.add(
                        pic.trim()
                    );

                });

            }

        });

    });

    document.getElementById(
        "personelHariIni"
    ).textContent =
        personel.size;
}

function tampilkanWidgetInfo(data) {

    const today = formatTanggal(new Date());

    const agendaHariIni =
        data.filter(item => item.Mulai === today);

    document.getElementById("widgetNow").innerHTML = `
        <div class="info-widget widget-live">
            <div class="widget-title">
                🟢 Agenda Hari Ini
            </div>
            <div>
                ${agendaHariIni.length} kegiatan
            </div>
        </div>
    `;

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);

    const agendaBesok =
        data.filter(item =>
            item.Mulai === formatTanggal(besok)
        );

    document.getElementById("widgetTomorrow").innerHTML = `
        <div class="info-widget widget-tomorrow">
            <div class="widget-title">
                📅 Agenda Besok
            </div>
            <div>
                ${agendaBesok.length} kegiatan
            </div>
        </div>
    `;
}

function tampilkanAgendaHariIni(data) {

    const today = formatTanggal(new Date());

    const agenda =
        data.filter(item =>
            item.Mulai === today
        );

    let html = "";

    agenda.forEach(item => {

        html += `
        <div class="today-item">

            <div class="today-time">
                ⏰ ${item.Pukul || "-"}
            </div>

            <div class="today-title">
                ${item.Kegiatan || "-"}
            </div>

            <div>
                📍 ${item.Lokasi || "-"}
            </div>

            ${item.Foto ? `<div class="today-pic">📷 Foto : ${item.Foto}</div>` : ""}
            ${item.Video ? `<div class="today-pic">🎥 Video : ${item.Video}</div>` : ""}
            ${item.Berita ? `<div class="today-pic">📰 Berita : ${item.Berita}</div>` : ""}
            ${item.Medsos ? `<div class="today-pic">📱 Medsos : ${item.Medsos}</div>` : ""}
            ${item.Drone ? `<div class="today-pic">🚁 Drone : ${item.Drone}</div>` : ""}
            ${item.Desain ? `<div class="today-pic">🎨 Desain : ${item.Desain}</div>` : ""}
            ${item["Video Editing"] ? `<div class="today-pic">🎬 Video Editing : ${item["Video Editing"]}</div>` : ""}
            ${item["Siaran Pers"] ? `<div class="today-pic">📄 Siaran Pers : ${item["Siaran Pers"]}</div>` : ""}
            ${item.Lainnya ? `<div class="today-pic">⭐ Lainnya : ${item.Lainnya}</div>` : ""}

        </div>
        `;

    });

    if (html === "") {

        html = `
        <div class="today-item">
            Tidak ada agenda hari ini
        </div>
        `;

    }

    document.getElementById("todayAgenda").innerHTML =
    html + html + html;

}

function tampilkanAgenda365Hari(data) {

    const hariIni = new Date();

    hariIni.setHours(0,0,0,0);

    const batas = new Date();

    batas.setDate(
        batas.getDate() + 365
    );

    const agenda = data.filter(item => {

        const tgl =
            parseTanggal(item.Mulai);

        return (
            tgl &&
            tgl >= hariIni &&
            tgl <= batas
        );

    });

    agenda.sort((a,b)=>
        parseTanggal(a.Mulai)
        -
        parseTanggal(b.Mulai)
    );

    let cards = "";

    agenda.forEach(item => {

        const foto =
            item.Foto || "";

        const video =
            item.Video || "";

        const berita =
            item.Berita || "";

        const medsos =
            item.Medsos || "";

        const drone =
            item.Drone ||
            item.drone ||
            "";

        const desain =
            item.Desain ||
            item.desain ||
            "";

        const videoEditing =
            item["Video Editing"] ||
            item.Video_Editing ||
            item.VideoEditing ||
            "";

        const siaranPers =
            item["Siaran Pers"] ||
            item.Siaran_Pers ||
            item.SiaranPers ||
            "";

        const lainnya =
            item.Lainnya ||
            item.lainnya ||
            "";

        let pic = "";

        if(foto)
            pic += `<div class="pic-item">📷 Foto : ${foto}</div>`;

        if(video)
            pic += `<div class="pic-item">🎥 Video : ${video}</div>`;

        if(berita)
            pic += `<div class="pic-item">📰 Berita : ${berita}</div>`;

        if(medsos)
            pic += `<div class="pic-item">📱 Medsos : ${medsos}</div>`;

        if(drone)
            pic += `<div class="pic-item">🚁 Drone : ${drone}</div>`;

        if(desain)
            pic += `<div class="pic-item">🎨 Desain : ${desain}</div>`;

        if(videoEditing)
            pic += `<div class="pic-item">🎬 Video Editing : ${videoEditing}</div>`;

        if(siaranPers)
            pic += `<div class="pic-item">📄 Siaran Pers : ${siaranPers}</div>`;

        if(lainnya)
            pic += `<div class="pic-item">⭐ Lainnya : ${lainnya}</div>`;

        cards += `

<div class="agenda-item">

    <div class="agenda-title">
        ${item.Kegiatan || "-"}
    </div>

    <div class="agenda-date">
        📅 ${formatTanggalIndonesia(item.Mulai)}
        -
        ${formatTanggalIndonesia(item.Selesai)}
    </div>

    <div class="agenda-header">
        ⏰ ${item.Pukul || "-"} WIB
    </div>

    <div class="agenda-location">
        📍 ${item.Lokasi || "-"}
    </div>

    <div class="pic-list">
        ${pic}
    </div>

        </div>

        `;

    });

    document.getElementById(
        "agendaCards"
    ).innerHTML =
        cards + cards;
}

function tampilkanKategori2026(data) {

    const kategori = {};

    data.forEach(item => {

        if (!item.Mulai) return;

        const tahun = item.Mulai.split("/")[2];

        if (tahun !== "2026") return;

        const nama = item.Kategori || "Lainnya";

        kategori[nama] =
            (kategori[nama] || 0) + 1;

    });

    let html = "";

    Object.entries(kategori)
        .sort((a, b) => b[1] - a[1])
        .forEach(([nama, jumlah]) => {

            html += `
            <div class="kategori-item">
                <span>${nama}</span>
                <strong>${jumlah}</strong>
            </div>
            `;

        });

    document.getElementById("kategori2026").innerHTML =
        html;
}

function updateClock() {

    const now = new Date();

    const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    const tanggalLengkap =
        `${hari[now.getDay()]}, `
        + `${now.getDate()} `
        + `${bulan[now.getMonth()]} `
        + `${now.getFullYear()}`;

    const jam =
        String(now.getHours()).padStart(2,"0")
        + ":"
        + String(now.getMinutes()).padStart(2,"0")
        + ":"
        + String(now.getSeconds()).padStart(2,"0")
        + " WIB";

    document.getElementById("tanggalSekarang")
        .textContent =
        "📅 " + tanggalLengkap;

    document.getElementById("jamSekarang")
        .textContent =
        "🕒 " + jam;

}

loadData();
updateClock();

setInterval(updateClock, 1000);
setInterval(loadData, 300000);