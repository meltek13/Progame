let submit = document.getElementById("submit");
let welcomeText = document.querySelector(".welcomeText");
let select = document.querySelector(".select");
let clickOnTitle = document.querySelector(".header div h1");
let count = 0;

fetch(`https://api.rawg.io/api/platforms?key=${process.env.API_KEY}`)
  .then((response) => response.json())
  .then((response) =>
    response.results.forEach((article) => {
      select.innerHTML += `<option value="${article.slug}" class="option" >${article.name}</option>`;
    })
  );

clickOnTitle.addEventListener("click", (e) => {
  welcomeText.innerHTML =
    "<h1>Welcome,</h1><p>The Hyper Progame is the world’s premier event for computer and video games and related products. At The Hyper Progame, the video game industry’s top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry. For three exciting days, leading-edge companies, groundbreaking new technologies, and never-before-seen products will be showcased. The Hyper Progame connects you with both new and existing partners, industry executives, gamers, and social influencers providing unprecedented exposure </p>";
  select.value = "";
  search.value = "";
  select.style.display = "block";
  PageList("");
});

select.addEventListener("click", (e) => {
  e.preventDefault();
  PageList(search.value);
});

const PageList = (argument) => {
  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    let articles = "";

    const fetchList = (url, argument) => {
      let finalURL = url + "&dates=2021-03-01,2022-01-01&ordering=-added";

      if (argument) {
        welcomeText.innerHTML = "";
        finalURL = url + "&search=" + argument;
      }
      // fetch de recherche
      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          response.results.forEach((article) => {
            let tabPlatform = [];
            let kindOfGame = [];

            article.genres.forEach((genre) => {
              kindOfGame.push(genre.name);
            });

            article.platforms.forEach((x) => {
              tabPlatform.push(
                `<span class="platformSpan" value="${x.platform.slug}">${x.platform.name}</span>`
              );
            });

            // find the developer / Not finish
            let developers = [];
            fetch(
              `https://api.rawg.io/api/games/${article.id}?key=${process.env.API_KEY}`
            )
              .then((response) => response.json())
              .then((response) => {
                response.developers.forEach((x) => {
                  developers.push(x.name);
                });
              });

            if (select.value === "") {
              count++;

              if (count > 9) {
                articles += `
                <article class="invisibleCard">
                <a href = "#pagedetail/${article.id}">
               <div class="imageCardPageList">
               
               <img src="${article.background_image}">
               
               <div class="cardDetailList">
               <span>${article.released}</span>
               <span>Developed by </span>
               <span>${kindOfGame.join(", ")}</span>
               <span><span class="bigger">${article.rating}</span> Votes ${
                  article.ratings_count
                }</span>
               
               
               </div>
               </div>
               </a>
               
               <div class="cardGame">
               <a href = "#pagedetail/${article.id}">
               <h3>${article.name} </h3>
               </a>
               <span class="platformGame">${tabPlatform.join(" ")}</span>
              </div>
              
          </article>
          `;
              } else {
                articles += `<article>
                <a href = "#pagedetail/${article.id}">
               <div class="imageCardPageList">
               
               <img src="${article.background_image}">
               
               <div class="cardDetailList">
               <span>${article.released}</span>
               <span>Developed by </span>
               <span>${kindOfGame.join(", ")}</span>
               <span><span class="bigger">${article.rating}</span> Votes ${
                  article.ratings_count
                }</span>
               
               
               </div>
               </div>
               </a>
               
               <div class="cardGame">
               <a href = "#pagedetail/${article.id}">
               <h3>${article.name} </h3>
               </a>
               <span class="platformGame">${tabPlatform.join(" ")}</span>
              </div>
              
          </article>
          `;
              }
            } else {
              document.querySelector(".page-list .articles").innerHTML = "";
              article.platforms.forEach((x) => {
                if (x.platform.slug === select.value) {
                  count++;

                  if (count > 9) {
                    articles += `<article class="invisibleCard">
                    <a href = "#pagedetail/${article.id}">
                   <div class="imageCardPageList">
                   
                   <img src="${article.background_image}">
                   
                   <div class="cardDetailList">
                   <span>${article.released}</span>
                   <span>Developed by </span>
                   <span>${kindOfGame.join(", ")}</span>
                   <span><span class="bigger">${article.rating}</span> Votes ${
                      article.ratings_count
                    }</span>
                   
                   
                   </div>
                   </div>
                   </a>
                   
                   <div class="cardGame">
                   <a href = "#pagedetail/${article.id}">
                   <h3>${article.name} </h3>
                   </a>
                   <span class="platformGame">${tabPlatform.join(" ")}</span>
                  </div>
                  
              </article>
              `;
                  } else {
                    articles += `<article>
                    <a href = "#pagedetail/${article.id}">
                   <div class="imageCardPageList">
                   
                   <img src="${article.background_image}">
                   
                   <div class="cardDetailList">
                   <span>${article.released}</span>
                   <span>Developed by </span>
                   <span>${kindOfGame.join(", ")}</span>
                   <span><span class="bigger">${article.rating}</span> Votes ${
                      article.ratings_count
                    }</span>
                   
                   
                   </div>
                   </div>
                   </a>
                   
                   <div class="cardGame">
                   <a href = "#pagedetail/${article.id}">
                   <h3>${article.name} </h3>
                   </a>
                   <span class="platformGame">${tabPlatform.join(" ")}</span>
                  </div>
                  
              </article>
              `;
                  }
                }
              });
            }
          });

          if (count === 0) {
            articles = '<p class="noResult">Aucun résultat ...</p>';
            document.querySelector(".showMore").display.style = "none";
          }

          count = 0;

          document.querySelector(".page-list .articles").innerHTML = articles;
          document.querySelector(".showMore").innerHTML += `show more`;

          // btn Show more ( affiche les 9 cards suivantes)
          let card = document.querySelectorAll(".page-list .articles article");
          let buttonShow = document.querySelector(".showMore");

          let countShowMore = 0;
          buttonShow.addEventListener("click", () => {
            card.forEach((x) => {
              if (x.classList.value === "invisibleCard") {
                countShowMore++;
                if (countShowMore < 10) {
                  x.classList.remove("invisibleCard");
                }
              }
            });
            countShowMore = 0;
          });
          let truc = document.querySelectorAll(".platformSpan");
          truc.forEach((x) => {
            fetch(
              `https://api.rawg.io/api/platforms?key=${process.env.API_KEY}`
            )
              .then((response) => response.json())
              .then((response) =>
                response.results.forEach((article) => {
                  if (x.innerHTML === article.name) {
                    x.addEventListener("click", (e) => {
                      articles = " ";
                      e.preventDefault();
                      article.games.forEach((game) => {
                        fetch(
                          `https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}`
                        )
                          .then((response) => response.json())
                          .then((response) => {
                            let tabPlatform = [];
                            let kindOfGame = [];

                            response.genres.forEach((genre) => {
                              kindOfGame.push(genre.name);
                            });

                            response.platforms.forEach((x) => {
                              tabPlatform.push(
                                `<span class="platformSpan" value="${x.platform.slug}">${x.platform.name}</span>`
                              );
                            });

                            articles += `<article>
                    <a href = "#pagedetail/${response.id}">
                   <div class="imageCardPageList">
                   
                   <img src="${response.background_image}">
                   
                   <div class="cardDetailList">
                   <span>${response.released}</span>
                   <span>Developed by </span>
                   <span>${kindOfGame.join(" ")}</span>
                   <span><span class="bigger">${response.rating}</span> Votes ${
                              response.ratings_count
                            }</span>
                   
                   
                   </div>
                   </div>
                   </a>
                   
                   <div class="cardGame">
                   <a href = "#pagedetail/${response.id}">
                   <h3>${response.name} </h3>
                   </a>
                   <span class="platformGame">${tabPlatform.join(" ")}</span>
                  </div>
                  
              </article>
              `;
                            document.querySelector(
                              ".page-list .articles"
                            ).innerHTML = articles;
                          });
                      });
                    });
                  }
                })
              );
          });
        });
    };

    fetchList(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}`,
      cleanedArgument
    );
  };

  const render = () => {
    select.style.display = "block";
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles">...loading</div>
      </section>
      <div class="divBtn">
      <button class="showMore"><button>
      <div>
    `;

    preparePage();
  };

  render();
};

submit.addEventListener("click", (e) => {
  e.preventDefault();
  select.value = "";
  PageList(search.value);
});

export { PageList };
