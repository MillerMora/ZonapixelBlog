let reviews = [];
let editingId = null;
const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
const API_BASE = 'http://localhost:3000/api/resenas';

// Cargar datos iniciales desde la API
async function init() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        if (data.exito) {
            reviews = data.datos.map(review => ({
                id: review.id_resena,
                name: review.nombre_juego,
                platform: review.plataforma,
                rating: review.calificacion_general,
                image: review.imagen_principal,
                description: review.contenido,
                date: review.fecha_publicacion.split('T')[0] // Formato YYYY-MM-DD
            }));
        }
    } catch (error) {
        console.error('Error cargando reseñas:', error);
        // Fallback a datos locales si la API falla
        reviews = [];
    }
    renderTable();
}

//pintado
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');

    if (reviews.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Crear mapa de IDs existentes en el DOM
    const existingRows = new Map();
    Array.from(tbody.children).forEach(row => {
        const id = parseInt(row.dataset.reviewId);
        if (id) existingRows.set(id, row);
    });

    // Crear mapa de IDs que deberían estar
    const currentIds = new Set(reviews.map(r => r.id));

    // 1. ELIMINAR filas que ya no existen en los datos
    existingRows.forEach((row, id) => {
        if (!currentIds.has(id)) {
            row.remove();
            existingRows.delete(id);
        }
    });

    // 2. ACTUALIZAR o CREAR filas según sea necesario
    reviews.forEach((review, index) => {
        let row = existingRows.get(review.id);

        if (!row) {
            // Crear nueva fila
            row = createReviewRow(review);
            tbody.appendChild(row);
        } else {
            // Actualizar contenido si cambió
            updateReviewRow(row, review);
        }

        // Reordenar si es necesario (mover al índice correcto)
        const currentIndex = Array.from(tbody.children).indexOf(row);
        if (currentIndex !== index) {
            if (index >= tbody.children.length) {
                tbody.appendChild(row);
            } else {
                tbody.insertBefore(row, tbody.children[index]);
            }
        }
    });
}

// Función para crear una nueva fila de reseña
function createReviewRow(review) {
    const row = document.createElement('tr');
    row.dataset.reviewId = review.id; // ID único para tracking

    row.innerHTML = `
        <td>
            <img src="${review.image || 'https://via.placeholder.com/60'}"
                 alt="${review.name}"
                 class="game-thumb"
                 onerror="this.src='https://via.placeholder.com/60'">
        </td>
        <td><strong>${review.name}</strong></td>
        <td>${review.platform}</td>
        <td><span class="rating-badge">${review.rating}/10</span></td>
        <td>${formatDate(review.date)}</td>
        <td>
            <button class="btn-edit" onclick="editReview(${review.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-delete" onclick="deleteReview(${review.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </td>
    `;

    return row;
}

// Función para actualizar una fila existente
function updateReviewRow(row, review) {
    // Verificar que la fila tenga todas las celdas necesarias
    if (!row.cells || row.cells.length < 6) return;

    // Actualizar imagen
    const img = row.cells[0].querySelector('img');
    if (img) {
        const newSrc = review.image || 'https://via.placeholder.com/60';
        if (img.src !== newSrc) {
            img.src = newSrc;
            img.alt = review.name;
        }
    }

    // Actualizar nombre
    const nameCell = row.cells[1].querySelector('strong') || row.cells[1];
    if (nameCell.textContent !== review.name) {
        row.cells[1].innerHTML = `<strong>${review.name}</strong>`;
    }

    // Actualizar plataforma
    if (row.cells[2].textContent !== review.platform) {
        row.cells[2].textContent = review.platform;
    }

    // Actualizar calificación
    const ratingText = `${review.rating}/10`;
    const ratingBadge = row.cells[3].querySelector('.rating-badge');
    if (ratingBadge && ratingBadge.textContent !== ratingText) {
        ratingBadge.textContent = ratingText;
    }

    // Actualizar fecha
    const formattedDate = formatDate(review.date);
    if (row.cells[4].textContent !== formattedDate) {
        row.cells[4].textContent = formattedDate;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function openCreateModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nueva Reseña';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewId').value = '';
    modal.show();
}

function editReview(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Reseña';
    document.getElementById('reviewId').value = review.id;
    document.getElementById('gameName').value = review.name;
    document.getElementById('platform').value = review.platform;
    document.getElementById('rating').value = review.rating;
    document.getElementById('imageUrl').value = review.image;
    document.getElementById('description').value = review.description;
    document.getElementById('releaseDate').value = review.date;

    modal.show();
}

async function saveReview() {
    const form = document.getElementById('reviewForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const reviewData = {
        nombre_juego: document.getElementById('gameName').value,
        plataforma: document.getElementById('platform').value,
        calificacion_general: parseFloat(document.getElementById('rating').value),
        imagen_principal: document.getElementById('imageUrl').value,
        contenido: document.getElementById('description').value,
        fecha_publicacion: document.getElementById('releaseDate').value
    };

    try {
        if (editingId) {
            // Actualizar
            const response = await fetch(`${API_BASE}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            const result = await response.json();
            if (!result.exito) {
                throw new Error(result.mensaje);
            }
        } else {
            // Crear
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            const result = await response.json();
            if (!result.exito) {
                throw new Error(result.mensaje);
            }
        }

        // Recargar datos desde la API
        await init();
        modal.hide();
        form.reset();
    } catch (error) {
        console.error('Error guardando reseña:', error);
        alert('Error al guardar la reseña: ' + error.message);
    }
}

async function deleteReview(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!result.exito) {
                throw new Error(result.mensaje);
            }
            // Recargar datos desde la API
            await init();
        } catch (error) {
            console.error('Error eliminando reseña:', error);
            alert('Error al eliminar la reseña: ' + error.message);
        }
    }
}

// Inicializar al cargar la página
init();
