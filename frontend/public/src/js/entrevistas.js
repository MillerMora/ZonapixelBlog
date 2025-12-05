const API_URL = "http://localhost:3000/api/entrevistas";

fetch(API_URL).then(response => {
    return response.json();
}).then(datos => {

    const entrevistasContainer = document.querySelector('.row.g-4');

    if (!entrevistasContainer) {
        return;
    }

    entrevistasContainer.innerHTML = '';

    if (datos.datos && datos.datos.length > 0) {
        datos.datos.forEach(entrevista => {
            const entrevistaElement = document.createElement('div');
            entrevistaElement.className = 'col-md-6 col-lg-4';
            entrevistaElement.innerHTML = `
                <a href="entrevista.html?id=${entrevista.id_entrevista}" class="interview-card-link">
                    <div class="interview-card">
                        <img src="${entrevista.imagen_principal || 'https://us.123rf.com/450wm/outchill/outchill1712/outchill171204062/91291455-example-text-written-on-green-simple-circle-rubber-vintage-stamp.jpg'}" alt="${entrevista.titulo}">
                        <div class="interview-content">
                            <h5>${entrevista.titulo}</h5>
                        </div>
                    </div>
                </a>
            `;
            entrevistasContainer.appendChild(entrevistaElement);
        });
    }

}).catch(error => {
    console.error('Error al cargar las entrevistas:', error);
});
