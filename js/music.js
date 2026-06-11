(function () {
    var DEFAULT_COVER = './img/icon/logo.png';
    var DEFAULT_THEME = '#171513';
    var MANIFEST_URL = './music/music-list.json';
    var ap = null;

    function encodeMusicUrl(fileName) {
        return './music/' + encodeURIComponent(fileName).replace(/%2F/g, '/');
    }

    function parseMusicFileName(fileName) {
        var baseName = fileName.replace(/\.mp3$/i, '').trim();
        var duration = '';
        var durationMatch = baseName.match(/^(\d+)s\s+(.+)$/i);
        var artistMatch;

        if (durationMatch) {
            duration = durationMatch[1];
            baseName = durationMatch[2].trim();
        }

        artistMatch = baseName.match(/^(.+?)\s+-\s+(.+)$/);
        if (artistMatch) {
            return {
                name: artistMatch[2].trim(),
                artist: artistMatch[1].trim(),
                duration: duration ? Number(duration) : undefined
            };
        }

        return {
            name: baseName,
            artist: '本地音乐',
            duration: duration ? Number(duration) : undefined
        };
    }

    function normalizeTrack(track) {
        var parsed;

        if (!track) {
            return null;
        }

        if (typeof track === 'string') {
            parsed = parseMusicFileName(track);
            return {
                name: parsed.name,
                artist: parsed.artist,
                url: encodeMusicUrl(track),
                cover: DEFAULT_COVER,
                theme: DEFAULT_THEME,
                duration: parsed.duration
            };
        }

        if (!track.url && track.name && /\.mp3$/i.test(track.name)) {
            parsed = parseMusicFileName(track.name);
            return {
                name: parsed.name,
                artist: parsed.artist,
                url: encodeMusicUrl(track.name),
                cover: track.cover || DEFAULT_COVER,
                theme: track.theme || DEFAULT_THEME,
                duration: parsed.duration
            };
        }

        if (!track.url || !/\.mp3(?:$|[?#])/i.test(track.url)) {
            return null;
        }

        return {
            name: track.name || parseMusicFileName(track.url.split('/').pop()).name,
            artist: track.artist || '本地音乐',
            url: track.url,
            cover: track.cover || DEFAULT_COVER,
            theme: track.theme || DEFAULT_THEME,
            duration: track.duration
        };
    }

    function getTrackLabel() {
        var title = $('.aplayer-title').text();
        var author = $('.aplayer-author').text();
        return (title + author).trim() || '未播放音乐';
    }

    function updateMusicName() {
        $('#music-name').html(getTrackLabel());
    }

    function updateFooterTrack() {
        $('#lrc').html("<span class='lrc-show'><i class='iconfont icon-music'></i> " + getTrackLabel() + " <i class='iconfont icon-music'></i></span>");
    }

    function showMessage(message, icon) {
        if (window.iziToast) {
            iziToast.show({
                timeout: 4500,
                iconUrl: icon,
                message: message
            });
        }
    }

    function bindPlayerEvents() {
        ap.on('play', function () {
            updateMusicName();
            updateFooterTrack();
            if (window.iziToast) {
                iziToast.info({
                    timeout: 8000,
                    iconUrl: './img/icon/music.png',
                    displayMode: 'replace',
                    message: getTrackLabel()
                });
            }
            $('#play').html("<i class='iconfont icon-pause'>");
            if ($(document).width() >= 990) {
                $('.power').css('cssText', 'display:none');
                $('#lrc').css('cssText', 'display:block !important');
            }
        });

        ap.on('pause', function () {
            $('#play').html("<i class='iconfont icon-play'>");
            if ($(document).width() >= 990) {
                $('#lrc').css('cssText', 'display:none !important');
                $('.power').css('cssText', 'display:block');
            }
        });

        ap.on('listswitch', updateMusicName);
        ap.on('listswitch', updateFooterTrack);
    }

    function bindControls() {
        $('#music').hover(function () {
            $('.music-text').css('display', 'none');
            $('.music-volume').css('display', 'flex');
        }, function () {
            $('.music-text').css('display', 'block');
            $('.music-volume').css('display', 'none');
        });

        $('#open-music').on('click', function () {
            $('#hitokoto').css('display', 'none');
            $('#music').css('display', 'flex');
        });

        $('#hitokoto').hover(function () {
            $('#open-music').css('display', 'flex');
        }, function () {
            $('#open-music').css('display', 'none');
        });

        $('#music-close').on('click', function () {
            $('#music').css('display', 'none');
            $('#hitokoto').css('display', 'flex');
        });

        $('#play').on('click', function () {
            if (!ap) {
                showMessage('音乐列表还没有加载完成', './img/icon/warn.png');
                return;
            }
            ap.toggle();
            updateMusicName();
        });

        $('#last').on('click', function () {
            if (!ap) {
                return;
            }
            ap.skipBack();
            updateMusicName();
        });

        $('#next').on('click', function () {
            if (!ap) {
                return;
            }
            ap.skipForward();
            updateMusicName();
        });

        $('#music-open').on('click', function () {
            if ($(document).width() >= 990) {
                $('#box').css('display', 'block');
                $('#row').css('display', 'none');
                $('#more').css('cssText', 'display:none !important');
            }
        });
    }

    function initPlayer(audio) {
        if (!window.APlayer) {
            throw new Error('APlayer is not loaded');
        }

        ap = new APlayer({
            container: document.getElementById('aplayer'),
            order: 'random',
            preload: 'metadata',
            listMaxHeight: '336px',
            volume: '0.5',
            mutex: true,
            lrcType: 0,
            audio: audio
        });

        window.ap = ap;
        bindPlayerEvents();
        updateMusicName();
    }

    function fetchJson(url) {
        return fetch(url, { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Request failed: ' + response.status);
            }
            return response.json();
        });
    }

    function loadManifest() {
        return fetchJson(MANIFEST_URL).then(function (tracks) {
            if (!Array.isArray(tracks)) {
                throw new Error('music-list.json must be an array');
            }
            return tracks;
        });
    }

    function loadMusicList() {
        return loadManifest().then(function (tracks) {
            return tracks
                .map(normalizeTrack)
                .filter(Boolean);
        });
    }

    window.changevolume = function () {
        var x = $('#volume').val();

        if (ap) {
            ap.volume(x, true);
        }

        if (x == 0) {
            $('#volume-ico').html("<i class='iconfont icon-volume-x'></i>");
        } else if (x > 0 && x <= 0.3) {
            $('#volume-ico').html("<i class='iconfont icon-volume'></i>");
        } else if (x > 0.3 && x <= 0.6) {
            $('#volume-ico').html("<i class='iconfont icon-volume-1'></i>");
        } else {
            $('#volume-ico').html("<i class='iconfont icon-volume-2'></i>");
        }
    };

    bindControls();

    loadMusicList()
        .then(function (audio) {
            if (!audio.length) {
                throw new Error('No local mp3 files found');
            }
            initPlayer(audio);
        })
        .catch(function (error) {
            console.error('音乐列表加载失败：', error);
            $('#music-name').html('音乐列表加载失败');
            showMessage('音乐列表加载失败，请先运行 node scan-music.js 生成本地清单', './img/icon/warn.png');
        });
})();
