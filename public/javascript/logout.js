async function logout() {
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type' : 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}


function idleTimer() {
    var time;

    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.onclick = resetTimer;
    window.onscroll = resetTimer;
    window.onkeypress = resetTimer;

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, (1000 * 60) * 15);
    }
}

idleTimer();

document.querySelector('#logout').addEventListener('click', logout);
