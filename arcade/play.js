(function () {
  var main = document.getElementById('playMain');
  var moreSection = document.getElementById('playMore');
  var moreRow = document.getElementById('playMoreRow');

  var params = new URLSearchParams(window.location.search);
  var gameId = params.get('game');

  function showMessage(text) {
    main.innerHTML = '<p class="play-status">' + text + '</p>';
  }

  function renderGame(game, allGames) {
    document.title = game.name + ' - Babu Science';

    main.innerHTML =
      '<h1 class="play-title">' + game.name + '</h1>' +
      '<div class="play-screen">' +
        '<div class="play-screen-inner">' +
          '<button type="button" class="play-cover" id="playCover" style="background-image:url(' + game.thumbnail + ')" aria-label="Play ' + game.name + '">' +
            '<span class="play-cover-btn"><span class="tri"></span>Play</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="play-meta">' +
        '<p class="play-description">' + game.description + '</p>' +
        (game.tags && game.tags.length
          ? '<div class="play-tags">' + game.tags.map(function (t) { return '<span class="play-tag">' + t + '</span>'; }).join('') + '</div>'
          : '') +
        '<div class="play-actions">' +
          '<a href="' + game.folder + '/index.html" target="_blank" rel="noopener">Open in new tab</a>' +
        '</div>' +
      '</div>';

    var cover = document.getElementById('playCover');
    var screenInner = document.querySelector('.play-screen-inner');
    cover.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.className = 'play-frame';
      iframe.src = game.folder + '/index.html';
      iframe.title = game.name;
      iframe.allow = 'autoplay; fullscreen';
      screenInner.innerHTML = '';
      screenInner.appendChild(iframe);
    });

    var EXT_ICON = '<svg class="ext-icon" width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var others = allGames.filter(function (g) { return g.id !== game.id; });
    if (others.length) {
      moreRow.innerHTML = others.map(function (g) {
        var isExt = g.type === 'external';
        var href = isExt ? g.url : 'play.html?game=' + encodeURIComponent(g.id);
        var target = isExt ? ' target="_blank" rel="noopener"' : '';
        return (
          '<a class="play-more-card" href="' + href + '"' + target + '>' +
            '<span class="play-more-thumb"><img src="' + g.thumbnail + '" alt="' + g.name + ' cover art" loading="lazy" /></span>' +
            '<span class="play-more-name">' + g.name + (isExt ? EXT_ICON : '') + '</span>' +
          '</a>'
        );
      }).join('');
      moreSection.hidden = false;
    }
  }

  if (!gameId) {
    showMessage('No game specified. <a href="../arcade.html" style="color:#fff">Back to the Arcade</a>.');
    return;
  }

  fetch('games.json')
    .then(function (res) {
      if (!res.ok) throw new Error('games.json ' + res.status);
      return res.json();
    })
    .then(function (games) {
      var game = games.find(function (g) { return g.id === gameId; });
      if (!game) {
        showMessage('Couldn&rsquo;t find that game. <a href="../arcade.html" style="color:#fff">Back to the Arcade</a>.');
        return;
      }
      if (game.type === 'external') {
        window.location.href = game.url;
        return;
      }
      renderGame(game, games);
    })
    .catch(function (err) {
      console.error(err);
      showMessage('Couldn&rsquo;t load the game list. <a href="../arcade.html" style="color:#fff">Back to the Arcade</a>.');
    });
})();
