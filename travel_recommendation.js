document.addEventListener("DOMContentLoaded", () => {
  const home = document.getElementById("home");
  const aboutUs = document.getElementById("about-us");
  const contactUs = document.getElementById("contact-us");
  const navLinks = document.querySelectorAll("ul li a");
  const searchForm = document.getElementById("search-form");
  const resultsContainer = document.getElementById("results-container");
  const clearBtn = document.getElementById("clear-btn");

  aboutUs.style.display = "none";
  contactUs.style.display = "none";
  resultsContainer.style.display = "none";

  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", () => {
      resultsContainer.textContent = "";
      resultsContainer.style.display = "none";

      if (navLink.id === "nav-home") {
        home.style.display = "block";
        aboutUs.style.display = "none";
        contactUs.style.display = "none";
        searchForm.style.display = "block";
      }

      if (navLink.id === "nav-about") {
        home.style.display = "none";
        aboutUs.style.display = "block";
        contactUs.style.display = "none";
        searchForm.style.display = "none";
      }

      if (navLink.id === "nav-contact") {
        home.style.display = "none";
        aboutUs.style.display = "none";
        contactUs.style.display = "block";
        searchForm.style.display = "none";
      }
    });
  });

  fetch("./travel_recommendation_api.json")
    .then((response) => {
      return response.json();
    })
    .then((travelData) => {
      const searchFormSubmit = document.getElementById("search-btn");
      searchFormSubmit.addEventListener("click", (e) => {
        const form = document.getElementById("search-form");

        home.style.display = "none";
        aboutUs.style.display = "none";
        contactUs.style.display = "none";

        e.preventDefault();

        const formData = new FormData(form);
        const searchInput = formData.get("search-input");

        let foundMatch = false;

        for (let key in travelData) {
          let cleanedSearchInput = searchInput.trim().toLowerCase();
          if (cleanedSearchInput === "country")
            cleanedSearchInput = "countries";

          if (
            cleanedSearchInput === key ||
            cleanedSearchInput.includes(key) ||
            key.includes(cleanedSearchInput)
          ) {
            foundMatch = true;
            resultsContainer.textContent = "";
            resultsContainer.style.display = "grid";

            if (key === "countries") {
              travelData[key].forEach((country) => {
                country.cities.forEach((city) => {
                  const destinationDiv = document.createElement("div");
                  destinationDiv.classList.add("destination-div");

                  const h2 = document.createElement("h2");
                  const img = document.createElement("img");
                  const p = document.createElement("p");

                  h2.textContent = city.name;
                  img.src = city.imageUrl;
                  img.alt = city.name;
                  img.classList.add("destination-img");
                  p.textContent = city.description;

                  destinationDiv.appendChild(img);
                  destinationDiv.appendChild(h2);
                  destinationDiv.appendChild(p);
                  resultsContainer.appendChild(destinationDiv);
                });
              });
            }

            if (key === "temples" || key === "beaches") {
              travelData[key].forEach((destination) => {
                const destinationDiv = document.createElement("div");
                destinationDiv.classList.add("destination-div");

                const h2 = document.createElement("h2");
                const img = document.createElement("img");
                const p = document.createElement("p");

                h2.textContent = destination.name;
                img.src = destination.imageUrl;
                img.alt = destination.name;
                img.classList.add("destination-img");
                p.textContent = destination.description;

                destinationDiv.appendChild(img);
                destinationDiv.appendChild(h2);
                destinationDiv.appendChild(p);
                resultsContainer.appendChild(destinationDiv);
              });
            }
          }
        }

        if (!foundMatch) {
          alert(`No data found for "${searchInput.trim()}"`);

          home.style.display = "block";
          aboutUs.style.display = "none";
          contactUs.style.display = "none";
          searchForm.style.display = "block";
          resultsContainer.textContent = "";
          resultsContainer.style.display = "none";
        }
      });
    })
    .catch((error) => {
      throw new Error("Error fetching data: ", error);
    });

  clearBtn.addEventListener("click", () => {
    resultsContainer.textContent = "";
    const input = document.getElementById("search-input");
    input.value = "";
    home.style.display = "block";
    resultsContainer.style.display = "none";
  });
});
