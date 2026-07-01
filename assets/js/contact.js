document.addEventListener("DOMContentLoaded", () => {
    // 1. Inisialisasi Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Konfigurasi Endpoint & WhatsApp
    const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; 
    const ADMIN_WA_NUMBER = "62812XXXXXXXX"; // Ganti dengan nomor Admin (tanpa +)

    const form = document.getElementById("cph-contact-form");
    const inputs = document.querySelectorAll(".cph-contact-input");
    const submitBtn = document.getElementById("cph-contact-submit");
    const btnText = submitBtn.querySelector(".cph-contact-btn-text");
    const btnIcon = submitBtn.querySelector(".cph-contact-btn-icon");

    const modal = document.getElementById("cph-contact-modal");
    const countdownEl = document.getElementById("cph-contact-countdown");
    const manualBtn = document.getElementById("cph-contact-manual-wa");

    // 2. Floating Label Logic
    // Menambahkan class 'is-filled' jika input memiliki nilai
    const checkInputFill = (input) => {
        if (input.value.trim() !== "") {
            input.classList.add("is-filled");
        } else {
            input.classList.remove("is-filled");
        }
    };

    inputs.forEach(input => {
        // Cek inisial saat diload
        checkInputFill(input);

        input.addEventListener("input", () => {
            checkInputFill(input);
            // Hapus status invalid saat user mulai mengetik
            if(input.classList.contains("is-invalid")) {
                input.classList.remove("is-invalid");
            }
        });

        input.addEventListener("change", () => checkInputFill(input));
    });

    // 3. Form Validation Logic
    const validateForm = () => {
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute("required")) {
                let isFieldValid = true;

                // Cek Kosong
                if (input.value.trim() === "") {
                    isFieldValid = false;
                }

                // Cek Validasi Email
                if (input.type === "email" && input.value.trim() !== "") {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) isFieldValid = false;
                }

                // Cek Validasi WhatsApp (Hanya angka dan +)
                if (input.type === "tel" && input.value.trim() !== "") {
                    const phoneRegex = /^[0-9+]+$/;
                    if (!phoneRegex.test(input.value)) isFieldValid = false;
                }

                if (!isFieldValid) {
                    input.classList.add("is-invalid");
                    isValid = false;
                } else {
                    input.classList.remove("is-invalid");
                }
            }
        });

        return isValid;
    };

    // 4. Submit & Fetch GAS
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // UI Loading State
        submitBtn.disabled = true;
        btnText.textContent = "Mengirim...";
        
        // Ganti icon menjadi spinner
        const oldIconData = btnIcon.getAttribute("data-lucide");
        btnIcon.setAttribute("data-lucide", "loader-circle");
        btnIcon.classList.add("cph-contact-spin");
        lucide.createIcons();

        // Siapkan Data
        const formData = new FormData();
        formData.append("Tanggal", new Date().toLocaleString("id-ID"));
        formData.append("Nama", document.getElementById("cph-contact-name").value);
        formData.append("Email", document.getElementById("cph-contact-email").value);
        formData.append("WhatsApp", document.getElementById("cph-contact-wa").value);
        formData.append("Perusahaan", document.getElementById("cph-contact-company").value || "-");
        formData.append("Jenis Pertanyaan", document.getElementById("cph-contact-type").value);
        formData.append("Pesan", document.getElementById("cph-contact-message").value);

        try {
            // Proses Post ke Apps Script (Mode no-cors sering digunakan untuk GAS macro)
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: formData,
                mode: 'no-cors' 
            });

            // 5. Success Flow
            showSuccessModal();

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
        } finally {
            // Kembalikan UI Button
            submitBtn.disabled = false;
            btnText.textContent = "Kirim Pertanyaan";
            btnIcon.setAttribute("data-lucide", oldIconData);
            btnIcon.classList.remove("cph-contact-spin");
            lucide.createIcons();
        }
    });

    // 6. Modal & WhatsApp Redirect
    const showSuccessModal = () => {
        modal.classList.add("is-active");
        
        const nama = document.getElementById("cph-contact-name").value;
        const jenis = document.getElementById("cph-contact-type").value;
        
        // Format Pesan WhatsApp
        const waText = `Halo Admin CV Massusi Herbal Utama.\n\nSaya baru saja mengirim formulir melalui website.\nNama : ${nama}\nJenis Pertanyaan : ${jenis}\n\nSaya ingin berdiskusi lebih lanjut. Terima kasih.`;
        const waLink = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waText)}`;

        let counter = 3;
        countdownEl.textContent = counter;

        const countdownInterval = setInterval(() => {
            counter--;
            countdownEl.textContent = counter;

            if (counter <= 0) {
                clearInterval(countdownInterval);
                
                // Coba buka tab baru
                const newWindow = window.open(waLink, '_blank');
                
                // Fallback jika browser memblokir popup
                if(!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    manualBtn.style.display = "block";
                    manualBtn.onclick = () => window.open(waLink, '_blank');
                    document.querySelector('.cph-contact-modal-redirect').style.display = "none";
                } else {
                    // Reset dan tutup modal jika berhasil terbuka
                    resetFormAndCloseModal();
                }
            }
        }, 1000);
    };

    const resetFormAndCloseModal = () => {
        modal.classList.remove("is-active");
        form.reset();
        inputs.forEach(input => checkInputFill(input));
        manualBtn.style.display = "none";
        document.querySelector('.cph-contact-modal-redirect').style.display = "block";
    };
});