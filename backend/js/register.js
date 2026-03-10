document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            

            const name = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const username = document.getElementById('userName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmpassword = document.getElementById('confirmPassword').value;
            
            if (!name || !lastname || !username || !email || !password || !confirmpassword) {
                alert('Por favor, llena los campos faltantes');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5230/api/Register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        lastname: lastname,
                        username: username,
                        email: email,
                        password: password,
                        confirmpassword: confirmpassword
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Registro exitoso');
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'ha habido un error al momento de registrarse');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Verifica que el servidor esté funcionando.');
            }
        });
    }
});

