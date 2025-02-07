const ids = [
  "nama_mitra",
  "jenis_karya",
  "deskripsi_karya",
  "manfaat_karya",
  "no_surat_karya",
  "tgl_surat_karya",
];

// Cari elemen pertama untuk menyisipkan tombol sebelum elemen ini
const firstInput = document.getElementById("nama_mitra");
if (firstInput) {
  const firstFormGroup = firstInput.closest(".form-group.form-float");
  if (firstFormGroup) {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Tampilkan/Sembunyikan Form";
    toggleButton.classList.add("btn", "btn-primary", "ml-2");
    toggleButton.style.marginBottom = "10px";
    toggleButton.onclick = () => {
      ids.forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
          const formGroup = input.closest(".form-group.form-float");
          if (formGroup) {
            formGroup.classList.toggle("d-none");
          }
        }
      });
    };

    // Sisipkan tombol sebelum elemen form pertama
    firstFormGroup.parentNode.insertBefore(toggleButton, firstFormGroup);
  }
}

// Sembunyikan semua form group awalnya
ids.forEach((id) => {
  const input = document.getElementById(id);
  if (input) {
    const formGroup = input.closest(".form-group.form-float");
    if (formGroup) {
      formGroup.classList.add("d-none");
    }
  }
});
