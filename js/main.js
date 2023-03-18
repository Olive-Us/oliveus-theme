document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initYouTube, 3500);
  function initYouTube() {
    // Activate only if not already activated
    if (window.hideYTActivated) return;
    // Load API
    if (typeof YT === 'undefined') {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    // Activate on all players
    let onYouTubeIframeAPIReadyCallbacks = [];
    let players = [];
    for (let playerWrap of document.querySelectorAll(".hytPlayerWrap")) {
      let playerFrame = playerWrap.querySelector("iframe");

      let onPlayerStateChange = function (event) {
        if (event.data == YT.PlayerState.ENDED) {
          playerWrap.classList.add("ended");
        } else if (event.data == YT.PlayerState.PAUSED) {
          playerWrap.classList.add("paused");
        } else if (event.data == YT.PlayerState.PLAYING) {
          playerWrap.classList.remove("ended");
          playerWrap.classList.remove("paused");
        }
      };

      let player;
      onYouTubeIframeAPIReadyCallbacks.push(function () {
        player = new YT.Player(playerFrame, {
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
        players.push(player);
      });

      playerWrap.addEventListener("click", function () {
        let playerState = player.getPlayerState();
        if (playerState == YT.PlayerState.ENDED) {
          player.seekTo(0);
        } else if (playerState == YT.PlayerState.PAUSED) {
          player.playVideo();
        }
      });
    }

    window.onYouTubeIframeAPIReady = function () {
      for (let callback of onYouTubeIframeAPIReadyCallbacks) {
        callback();
      }
    };

    window.hideYTActivated = true;


    [...document.querySelectorAll('.modal')].forEach(function(el) {
      el.addEventListener('hide.bs.modal', function (event) {
        players.forEach(player => player && player.stopVideo && player.stopVideo())
      })
    })
  }
});