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

const accordion = document.querySelectorAll(".accordion-item");

accordion.forEach(item => {

    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {

        accordion.forEach(other => {

            if(other !== item){
                other.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

});

lucide.createIcons();