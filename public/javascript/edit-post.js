async function editFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
    const title = document.querySelector('input[name="post-title"]').value;
    const comment = document.querySelector('.form-textarea').value;

    console.log(id, title, comment)

    const response = await fetch(`/api/posts/${id}`, {
        method: 'put',
        body: JSON.stringify({
            title,
            comment
        }),
        headers: { 'Content-Type' : 'application/json' }
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.update-btn').addEventListener('click', editFormHandler);