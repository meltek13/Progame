const PageDetail = (argument) => {
  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");

    const fetchGame = (url, argument) => {
      let finalURL = url + argument + "?key=" + process.env.API_KEY;

      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          let {
            background_image,
            website,
            name,
            released,
            description,
            developers,
            platforms,
            publishers,
            genres,
            tags,
            stores,
            ratings,
            rating,
          } = response;

          // fetch pour the most similar Game
          fetch(`https://api.rawg.io/api/genres?key=${process.env.API_KEY}`)
            .then((response) => response.json())
            .then((response) => {
              let MostSimilarGame = [];
              let score = 1;

              genres.forEach((x) => {
                response.results.forEach((genre) => {
                  if (genre.name === x.name) {
                    genre.games.forEach((z) => {
                      if (MostSimilarGame.length === 0) {
                        MostSimilarGame.push([z.name, score, z.id]);
                      } else {
                        let verifyIfAlreadyExist = false;
                        for (let i = 0; i < MostSimilarGame.length; i++)
                          if (MostSimilarGame[i][0].includes(z.name)) {
                            MostSimilarGame[i][1] += 1;
                            verifyIfAlreadyExist = true;
                          }
                        if (verifyIfAlreadyExist === false) {
                          MostSimilarGame.push([z.name, score, z.id]);
                        }
                      }
                    });
                  }
                });
              });
              MostSimilarGame.sort(function (a, b) {
                return b[1] - a[1];
              });

              MostSimilarGame.forEach((game) => {
                if (game[0] != name) {
                  fetch(
                    `https://api.rawg.io/api/games/${game[2]}?key=${process.env.API_KEY}`
                  )
                    .then((response) => response.json())
                    .then((response) => {
                      let tabPlatform = [];
                      let kindOfGame = [];

                      response.genres.forEach((genre) => {
                        kindOfGame.push(genre.name);
                      });

                      response.platforms.forEach((x) => {
                        tabPlatform.push(x.platform.name);
                      });

                      document.querySelector(
                        ".articles"
                      ).innerHTML += `<article>
                      <a href = "#pagedetail/${response.id}">
                     <div class="imageCardPageList">
                     
                     <img src="${response.background_image}">
                     
                     <div class="cardDetailList">
                     <span>${response.released}</span>
                     <span>Developed by </span>
                     <span>${kindOfGame.join(", ")}</span>
                     <span><span class="bigger">${
                       response.rating
                     }</span> Votes ${response.ratings_count}</span>
                     
                     
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
                    });
                }
              });
            });

          //fetch pour trouver les screenshots
          fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${name}`
          )
            .then((response) => response.json())
            .then((response) => {
              response.results.forEach((article) => {
                if (article.name === name) {
                  article.short_screenshots.forEach((x) => {
                    document.querySelector(
                      ".allScreenshot"
                    ).innerHTML += `<div class="screenshot"><img src="${x.image}" class="imgScreen"></div>`;
                  });
                }
              });
            });
          //fetch pour trouver le trailer
          fetch(
            `https://api.rawg.io/api/games/${response.id}/movies?key=${process.env.API_KEY}`
          )
            .then((response) => response.json())
            .then((response) => {
              let { results } = response;
              results.forEach((trailer) => {
                document.querySelector(
                  ".trailer"
                ).innerHTML = `<iframe src="${trailer.data.max}" frameborder="0"></iframe>`;
              });
            });

          let articleDOM = document.querySelector(".page-detail .article");

          let totalVote = 0;
          ratings.forEach((x) => {
            totalVote += x.count;
          });

          articleDOM.querySelector(
            "p.ratings"
          ).innerHTML = `<span>${rating}/5 - ${totalVote} votes</span> `;

          document.querySelector(
            ".imgPageDetail"
          ).style.backgroundImage = `url(${background_image})`;

          document.querySelector(
            ".website"
          ).innerHTML = `<a href="${website}">Check website   >></a>`;

          articleDOM.querySelector("h1.title").innerHTML = name;

          articleDOM.querySelector("p.release-date span").innerHTML = released;
          if (
            articleDOM.querySelector("p.release-date span").innerHTML === ""
          ) {
            articleDOM.querySelector("p.release-date span").innerHTML = "N/A";
          }

          articleDOM.querySelector("p.description").innerHTML = description;

          developers.forEach((x) => {
            articleDOM.querySelector("p.developer span").innerHTML += x.name;
          });
          if (articleDOM.querySelector("p.developer span").innerHTML === "") {
            articleDOM.querySelector("p.developer span").innerHTML = "N/A";
          }

          platforms.forEach((x) => {
            articleDOM.querySelector(
              "p.platforms span"
            ).innerHTML += `${x.platform.name}, `;
          });
          if (articleDOM.querySelector("p.platforms span").innerHTML === "") {
            articleDOM.querySelector("p.platforms span").innerHTML = "N/A";
          }

          publishers.forEach((x) => {
            articleDOM.querySelector(
              "p.publishers span"
            ).innerHTML += `${x.name}, `;
          });
          if (articleDOM.querySelector("p.publishers span").innerHTML === "") {
            articleDOM.querySelector("p.publishers span").innerHTML = "N/A";
          }

          genres.forEach((x) => {
            articleDOM.querySelector(
              "p.genres span"
            ).innerHTML += `${x.name}, `;
          });
          if (articleDOM.querySelector("p.genres span").innerHTML === "") {
            articleDOM.querySelector("p.genres span").innerHTML = "N/A";
          }

          tags.forEach((x) => {
            articleDOM.querySelector("p.tags span").innerHTML += `${x.name}, `;
          });
          if (articleDOM.querySelector("p.tags span").innerHTML === "") {
            articleDOM.querySelector("p.tags span").innerHTML = "N/A";
          }

          stores.forEach((x) => {
            articleDOM.querySelector(
              "p.stores span"
            ).innerHTML += `<span class=""storeDecoration><a href="https://${x.store.domain}">${x.store.name}<br/></a></span>`;
          });
          if (articleDOM.querySelector("p.stores span").innerHTML === "") {
            articleDOM.querySelector("p.stores span").innerHTML === "N/A";
          }
        });
    };

    fetchGame(`https://api.rawg.io/api/games/`, cleanedArgument);
  };

  const render = () => {
    let welcomeText = document.querySelector(".welcomeText");
    let select = document.querySelector(".select");
    welcomeText.innerHTML = " ";
    select.style.display = "none";

    pageContent.innerHTML = `
      <section class="page-detail">
        <div class="article">
          <div class="imgPageDetail"> <button class="btn website"></button></div>
          <div class="topOfpageDetail">
          <h1 class="title"></h1>
          <p class="ratings"></p>
          </div>
          
          <p class="description"></p>
          <div class="pageDetailsinfo">
          <p class="release-date"><strong>Release date</strong> <br/><span></span></p>
          <p class="developer"><strong>Developer</strong> <br/><span></span><p>
          <p class="platforms"><strong>Platforms</strong> <br/><span></span><p>
          <p class="publishers"><strong>Publishers</strong><br/><span></span><p>
          </div>
          <div class="otherDetails">
          <p class="genres"><strong>Genres</strong> <br/><span></span><p>
          <p class="tags"><strong>Tags</strong> <br/><span></span><p>
          </div>
          <h3 class="titleToBuy">BUY</h3>
          <p class="stores"><span></span><p>
          <h3 class="titleScreenshot"> SCREENSHOTS </h3>
          <div class="allScreenshot"></div>
          <h3 class="titleTrailer">TRAILER</h3>
          <div class="trailer"></div>
          <h3 class="titleTrailer">MOST SIMILAR GAMES</h3>
          <div class="articles"></div>
          
          
        </div>
      </section>
    `;

    preparePage();
  };

  render();
};
export { PageDetail };
