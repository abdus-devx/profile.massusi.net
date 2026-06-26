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

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
});