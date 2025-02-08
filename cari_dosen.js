async function loadDosenData() {
  try {
    const response = await fetch(chrome.runtime.getURL("data_dosen.json"));
    if (!response.ok) throw new Error("Gagal mengambil data dosen");
    const dosenData = await response.json();
    return dosenData.data;
  } catch (error) {
    console.error("Gagal memuat data dosen:", error);
    return [];
  }
}

function createDropdown(dosenList) {
  const inputField = document.getElementById("dosen_karya");
  if (!inputField) return console.error("Elemen input tidak ditemukan!");

  const container = document.createElement("div");
  container.className =
    "dropdown-container position-relative p-3 bg-light border rounded shadow-sm";

  const wrapper = document.createElement("div");
  wrapper.className = "dropdown-wrapper";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "form-control mb-2 border-0 shadow-sm";
  searchInput.placeholder = "Cari nama dosen...";
  searchInput.id = "search_dosen";

  const select = document.createElement("select");
  select.className = "form-select border-0 shadow-sm rounded w-100";
  select.multiple = true;
  select.style.height = "200px";
  select.style.overflowY = "auto";
  select.style.cursor = "pointer";
  select.style.backgroundColor = "#f8f9fa";

  let lastMatchedNIDN = null;

  function updateDropdown(search = "") {
    select.innerHTML = "";
    const filteredDosen = dosenList.filter(
      (dosen) =>
        dosen.name.toLowerCase().includes(search.toLowerCase()) ||
        dosen.nidn.includes(search)
    );

    if (filteredDosen.length >= 1) {
      const firstMatch = filteredDosen[0];
      lastMatchedNIDN = firstMatch.nidn;
      inputField.value = firstMatch.nidn;
    } else {
      lastMatchedNIDN = null;
      if (search === "") {
        inputField.value = "";
      }
    }

    filteredDosen.forEach((dosen, index) => {
      const option = document.createElement("option");
      option.value = dosen.nidn;
      option.textContent = `${dosen.name} (${dosen.nidn})`;
      option.className = "dropdown-item p-2 border-bottom";
      option.style.backgroundColor = index % 2 === 0 ? "#e3f2fd" : "#bbdefb";
      option.style.fontWeight = "500";
      option.style.color = "#212529";

      if (index === 0) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  }

  let debounceTimer;
  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateDropdown(searchValue);
    }, 300);
  });

  searchInput.addEventListener("keydown", (e) => {
    const options = select.options;
    const currentIndex = Array.from(options).findIndex((opt) => opt.selected);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex].selected = false;
          options[currentIndex + 1].selected = true;
          inputField.value = options[currentIndex + 1].value;
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex].selected = false;
          options[currentIndex - 1].selected = true;
          inputField.value = options[currentIndex - 1].value;
        }
        break;
    }
  });

  select.addEventListener("click", (e) => {
    if (e.target.tagName === "OPTION") {
      inputField.value = e.target.value;
      Array.from(select.options).forEach((opt) => {
        opt.selected = opt === e.target;
      });
    }
  });

  wrapper.appendChild(searchInput);
  wrapper.appendChild(select);
  container.appendChild(wrapper);
  inputField.parentNode.insertBefore(container, inputField);

  const urlParams = new URLSearchParams(window.location.search);
  const autoInputValue = urlParams.get("search_dosen");
  if (autoInputValue) {
    searchInput.value = autoInputValue;
    updateDropdown(autoInputValue);
  } else {
    updateDropdown();
  }
}

loadDosenData().then(createDropdown);
