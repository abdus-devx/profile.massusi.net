document.querySelectorAll('a[href^="#"]').forEach(link => {

link.addEventListener('click', e => {

e.preventDefault();

const target = document.querySelector(
link.getAttribute('href')
);

target.scrollIntoView({
behavior:'smooth'
});

});

});