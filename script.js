const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('nav-open');
    menuToggle.classList.toggle('active');
});

function actualizarCuentaRegresiva() {
    const ahora = new Date();
    const dia = ahora.getDay(); // 0 = domingo, 3 = miércoles
    const proximo = new Date(ahora);

    if (dia === 0 && ahora.getHours() < 10) {
        proximo.setHours(10, 0, 0, 0);
    } else if (dia < 3 || (dia === 3 && ahora.getHours() < 18)) {
        proximo.setDate(ahora.getDate() + (3 - dia));
        proximo.setHours(18, 0, 0, 0);
    } else {
        const diasHastaDomingo = (7 - dia) % 7 || 7;
        proximo.setDate(ahora.getDate() + diasHastaDomingo);
        proximo.setHours(10, 0, 0, 0);
    }

    const diferencia = proximo - ahora;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);

    const texto = dias > 0
        ? `${dias}d ${horas}h ${minutos}m`
        : `${horas}h ${minutos}m`;

    document.getElementById('countdown-numbers').textContent = texto;
}

actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 60000);

function renderizarActividades() {
    const contenedor = document.getElementById('activities-grid');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const proximas = actividades
        .filter(act => new Date(act.fecha + 'T00:00:00') >= hoy)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (proximas.length === 0) {
        contenedor.innerHTML = '<p class="no-activities">No hay actividades programadas por el momento.</p>';
        return;
    }

    contenedor.innerHTML = proximas.map(act => {
        const fechaObj = new Date(act.fecha + 'T00:00:00');
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
            <div class="activity-card">
                <div class="activity-date">${fechaFormateada}</div>
                <h3>${act.titulo}</h3>
                <p class="activity-meta">${act.hora} — ${act.lugar}</p>
                <p class="activity-desc">${act.descripcion}</p>
            </div>
        `;
    }).join('');
}

renderizarActividades();

const prayerForm = document.getElementById('prayer-form');

if (prayerForm) {
    prayerForm.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const datos = new FormData(prayerForm);

        fetch(prayerForm.action, {
            method: 'POST',
            body: datos,
            headers: { 'Accept': 'application/json' }
        })
        .then(respuesta => {
            if (respuesta.ok) {
                prayerForm.style.display = 'none';
                document.getElementById('prayer-success').style.display = 'block';
            } else {
                alert('Hubo un problema al enviar tu petición. Por favor intenta de nuevo.');
            }
        })
        .catch(() => {
            alert('No se pudo enviar. Revisa tu conexión a internet e intenta de nuevo.');
        });
    });
}