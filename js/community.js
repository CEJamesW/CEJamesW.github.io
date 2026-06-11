(function () {
    var REPO = 'CEJamesW/CEJamesW.github.io';
    var ISSUES_API = 'https://api.github.com/repos/' + REPO + '/issues?state=open&per_page=50&sort=created&direction=desc';
    var NEW_ISSUE_URL = 'https://github.com/' + REPO + '/issues/new';
    var GUESTBOOK_MARKER = '<!-- guestbook -->';
    var FRIEND_MARKER = '<!-- friend-link -->';
    var loadedGuestbook = false;
    var loadedFriends = false;

    function $(selector) {
        return document.querySelector(selector);
    }

    function $all(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    function setText(node, text) {
        node.textContent = text || '';
    }

    function createElement(tagName, className, text) {
        var element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function formatDate(value) {
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    function normalizeInput(value) {
        return (value || '').trim().replace(/\r/g, '');
    }

    function getField(body, label) {
        var pattern = new RegExp('\\*\\*' + label + '\\*\\*[：:]\\s*([^\\n]+)');
        var match = body.match(pattern);
        return match ? match[1].trim() : '';
    }

    function getBlock(body, label) {
        var pattern = new RegExp('\\*\\*' + label + '\\*\\*[：:]\\s*\\n([\\s\\S]*)');
        var match = body.match(pattern);
        return match ? match[1].trim() : '';
    }

    function buildIssueUrl(title, body, labels) {
        var params = new URLSearchParams({
            title: title,
            body: body
        });
        if (labels) {
            params.set('labels', labels);
        }
        return NEW_ISSUE_URL + '?' + params.toString();
    }

    function renderEmpty(container, text) {
        container.innerHTML = '';
        container.appendChild(createElement('div', 'community-empty', text));
    }

    function renderGuestbookIssue(issue) {
        var body = issue.body || '';
        var name = getField(body, '昵称') || issue.user.login;
        var message = getBlock(body, '留言') || body.replace(GUESTBOOK_MARKER, '').trim();
        var card = createElement('article', 'guestbook-card');
        var header = createElement('div', 'guestbook-card-header');
        var nameElement = createElement('strong', '', name);
        var dateElement = createElement('span', '', formatDate(issue.created_at));
        var content = createElement('p', '', message);
        var link = createElement('a', 'guestbook-link', '#' + issue.number);

        link.href = issue.html_url;
        link.target = '_blank';
        link.rel = 'noopener';

        header.appendChild(nameElement);
        header.appendChild(dateElement);
        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(link);
        return card;
    }

    function loadGuestbook() {
        var container = $('#guestbook-list');
        if (!container) {
            return;
        }
        setText(container, '加载中...');

        fetch(ISSUES_API, { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('GitHub issues request failed');
                }
                return response.json();
            })
            .then(function (issues) {
                var guestbookIssues = issues
                    .filter(function (issue) {
                        return !issue.pull_request && issue.body && issue.body.indexOf(GUESTBOOK_MARKER) !== -1;
                    })
                    .slice(0, 20);

                container.innerHTML = '';
                if (!guestbookIssues.length) {
                    renderEmpty(container, '还没有留言');
                    return;
                }
                guestbookIssues.forEach(function (issue) {
                    container.appendChild(renderGuestbookIssue(issue));
                });
            })
            .catch(function () {
                renderEmpty(container, '留言加载失败');
            });
    }

    function renderFriend(friend) {
        var card = createElement('a', 'friend-card');
        var title = createElement('strong', '', friend.name);
        var description = createElement('span', '', friend.description || friend.url);

        card.href = friend.url;
        card.target = '_blank';
        card.rel = 'noopener';
        card.appendChild(title);
        card.appendChild(description);
        return card;
    }

    function loadFriends() {
        var container = $('#friends-list');
        if (!container) {
            return;
        }
        setText(container, '加载中...');

        fetch('./data/friends.json', { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Friends request failed');
                }
                return response.json();
            })
            .then(function (friends) {
                container.innerHTML = '';
                if (!Array.isArray(friends) || !friends.length) {
                    renderEmpty(container, '暂无友链');
                    return;
                }
                friends.forEach(function (friend) {
                    if (friend && friend.name && friend.url) {
                        container.appendChild(renderFriend(friend));
                    }
                });
            })
            .catch(function () {
                renderEmpty(container, '友链加载失败');
            });
    }

    function activateTab(tabName) {
        $all('.community-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.getAttribute('data-community-tab') === tabName);
        });
        $all('.community-panel').forEach(function (panel) {
            panel.classList.toggle('active', panel.id === tabName + '-panel');
        });

        if (tabName === 'guestbook' && !loadedGuestbook) {
            loadedGuestbook = true;
            loadGuestbook();
        }
        if (tabName === 'friends' && !loadedFriends) {
            loadedFriends = true;
            loadFriends();
        }
    }

    function openCommunity(tabName) {
        var modal = $('#community-modal');
        if (!modal) {
            return;
        }
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        activateTab(tabName || 'guestbook');
    }

    function closeCommunity() {
        var modal = $('#community-modal');
        if (!modal) {
            return;
        }
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    function bindGuestbookForm() {
        var form = $('#guestbook-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            var name = normalizeInput($('#guestbook-name').value);
            var message = normalizeInput($('#guestbook-message').value);
            var body;
            var url;

            event.preventDefault();
            if (!name || !message) {
                return;
            }

            body = GUESTBOOK_MARKER + '\n**昵称**：' + name + '\n\n**留言**：\n' + message;
            url = buildIssueUrl('[留言] ' + name, body, 'guestbook');
            window.open(url, '_blank', 'noopener');
        });
    }

    function bindFriendForm() {
        var form = $('#friend-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            var name = normalizeInput($('#friend-name').value);
            var urlValue = normalizeInput($('#friend-url').value);
            var description = normalizeInput($('#friend-description').value);
            var body;
            var url;

            event.preventDefault();
            if (!name || !urlValue || !description) {
                return;
            }

            body = FRIEND_MARKER + '\n**站点名称**：' + name + '\n\n**链接**：' + urlValue + '\n\n**简介**：\n' + description;
            url = buildIssueUrl('[友链] ' + name, body, 'friend-link');
            window.open(url, '_blank', 'noopener');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var guestbookButton = $('#open-guestbook');
        var friendsButton = $('#open-friends');
        var closeButton = $('#community-close');
        var modal = $('#community-modal');

        if (guestbookButton) {
            guestbookButton.addEventListener('click', function () {
                openCommunity('guestbook');
            });
        }
        if (friendsButton) {
            friendsButton.addEventListener('click', function () {
                openCommunity('friends');
            });
        }
        if (closeButton) {
            closeButton.addEventListener('click', closeCommunity);
        }
        if (modal) {
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeCommunity();
                }
            });
        }

        document.addEventListener('click', function (event) {
            var tab = event.target.closest('.community-tab');
            if (tab) {
                activateTab(tab.getAttribute('data-community-tab'));
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeCommunity();
            }
        });

        bindGuestbookForm();
        bindFriendForm();
    });
})();
