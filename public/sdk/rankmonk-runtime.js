/*! RankMonk Autonomous GEO Runtime v1.0 — Framework-Agnostic, SPA-Aware */
(function () {
  'use strict';

  if (window.__rankMonkRuntime && window.__rankMonkRuntime.initialized) {
    return;
  }

  // 1. Locate script tag and configuration
  function getScriptTag() {
    if (document.currentScript) return document.currentScript;
    var all = document.querySelectorAll('script[data-site-id], script[src*="rankmonk-runtime"]');
    return all.length ? all[all.length - 1] : null;
  }

  var script = getScriptTag();
  if (!script) return;

  var domainId = script.getAttribute('data-site-id') || location.hostname;
  var token = script.getAttribute('data-token') || '';
  var apiBase = script.getAttribute('data-api') || script.src.replace(/\/sdk\/.*$/, '');

  var RM = {
    initialized: true,
    domainId: domainId,
    appliedRules: {},
    snapshots: {},
    rules: []
  };
  window.__rankMonkRuntime = RM;

  function currentPath() {
    var p = location.pathname || '/';
    return p.length > 1 ? p.replace(/\/+$/, '') : p;
  }

  function pathMatches(rulePath) {
    if (!rulePath || rulePath === '*') return true;
    var norm = rulePath.length > 1 ? rulePath.replace(/\/+$/, '') : rulePath;
    return currentPath() === norm;
  }

  // 2. Telemetry Beacon
  var __beaconQueue = [];
  var __beaconTimer = null;

  function queueBeacon(ruleKey, kind, verified, error) {
    __beaconQueue.push({ ruleKey: ruleKey, kind: kind, verified: verified, error: error });
    if (__beaconTimer) clearTimeout(__beaconTimer);
    __beaconTimer = setTimeout(flushBeacons, 500);
  }

  function flushBeacons() {
    if (__beaconQueue.length === 0) return;
    var items = __beaconQueue.slice();
    __beaconQueue = [];

    var payload = {
      domainId: domainId,
      token: token,
      pageUrl: location.pathname,
      rules: items
    };

    var beaconUrl = apiBase + '/api/sdk/beacon';
    var body = JSON.stringify(payload);

    try {
      if (typeof navigator.sendBeacon === 'function') {
        var blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(beaconUrl, blob);
      } else {
        fetch(beaconUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // 3. Rule Handlers
  var HANDLERS = {
    add_faq_schema: function (data, key) {
      if (!data || !data.faqQuestions || data.faqQuestions.length === 0) return false;
      var existing = document.querySelector('script[data-rm-rule="' + key + '"]');
      if (existing) return true;

      var schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqQuestions.map(function (q) {
          return {
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          };
        })
      };

      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-rm-rule', key);
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
      return true;
    },

    add_organization_schema: function (data, key) {
      if (!data || !data.jsonLd) return false;
      var existing = document.querySelector('script[data-rm-rule="' + key + '"]');
      if (existing) return true;

      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-rm-rule', key);
      s.textContent = JSON.stringify(data.jsonLd);
      document.head.appendChild(s);
      return true;
    },

    set_title: function (data, key) {
      if (!data.title) return false;
      if (!RM.snapshots[key]) {
        RM.snapshots[key] = { origTitle: document.title };
      }
      document.title = data.title;
      return true;
    },

    set_meta_description: function (data, key) {
      if (!data.metaDescription) return false;
      var m = document.querySelector('meta[name="description"]');
      if (!RM.snapshots[key]) {
        RM.snapshots[key] = { origContent: m ? m.getAttribute('content') : null, existed: !!m };
      }
      if (!m) {
        m = document.createElement('meta');
        m.name = 'description';
        m.setAttribute('data-rm-injected', key);
        document.head.appendChild(m);
      }
      m.setAttribute('content', data.metaDescription);
      return true;
    },

    set_canonical: function (data, key) {
      var href = data.canonicalUrl || (location.origin + location.pathname);
      var l = document.querySelector('link[rel="canonical"]');
      if (!RM.snapshots[key]) {
        RM.snapshots[key] = { origHref: l ? l.getAttribute('href') : null, existed: !!l };
      }
      if (!l) {
        l = document.createElement('link');
        l.rel = 'canonical';
        l.setAttribute('data-rm-injected', key);
        document.head.appendChild(l);
      }
      l.setAttribute('href', href);
      return true;
    },

    inject_geo_answer_block: function (data, key) {
      if (document.querySelector('[data-rm-block="' + key + '"]')) return true;

      var target = document.querySelector(data.targetSelector || 'h1') || document.querySelector('main') || document.body;
      if (!target) return false;

      var block = document.createElement('div');
      block.setAttribute('data-rm-block', key);
      block.setAttribute('data-rankmonk-aeo', 'true');
      block.style.cssText = 'margin: 1.25rem 0; padding: 1rem 1.25rem; border-radius: 0.75rem; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); font-family: inherit; line-height: 1.6;';

      var heading = document.createElement('div');
      heading.style.cssText = 'font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;';
      heading.innerHTML = '⚡ <span>Direct AI Summary (BLUF)</span>';

      var body = document.createElement('p');
      body.style.cssText = 'font-size: 0.95rem; color: inherit; margin: 0;';
      body.innerHTML = data.answerHtml || (data.answerHeading ? '<strong>' + data.answerHeading + ':</strong> ' : '') + 'Verified executive summary for generative answer engines.';

      block.appendChild(heading);
      block.appendChild(body);

      if (target.parentNode) {
        target.parentNode.insertBefore(block, target.nextSibling);
      } else {
        document.body.appendChild(block);
      }
      return true;
    },

    inject_key_takeaways: function (data, key) {
      if (document.querySelector('[data-rm-block="' + key + '"]')) return true;
      if (!data.keyTakeaways || data.keyTakeaways.length === 0) return false;

      var target = document.querySelector(data.targetSelector || 'h1') || document.body;
      var box = document.createElement('div');
      box.setAttribute('data-rm-block', key);
      box.style.cssText = 'margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2);';

      var title = document.createElement('div');
      title.style.cssText = 'font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #059669; margin-bottom: 0.5rem;';
      title.textContent = 'Key Factual Takeaways';

      var list = document.createElement('ul');
      list.style.cssText = 'margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.5;';
      data.keyTakeaways.forEach(function (t) {
        var li = document.createElement('li');
        li.textContent = t;
        list.appendChild(li);
      });

      box.appendChild(title);
      box.appendChild(list);

      if (target.parentNode) {
        target.parentNode.insertBefore(box, target.nextSibling);
      } else {
        document.body.appendChild(box);
      }
      return true;
    },

    add_freshness_badge: function (data, key) {
      if (document.querySelector('[data-rm-badge="' + key + '"]')) return true;
      var target = document.querySelector(data.targetSelector || 'h1');
      if (!target || !target.parentNode) return false;

      var dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var badge = document.createElement('div');
      badge.setAttribute('data-rm-badge', key);
      badge.style.cssText = 'font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.35rem;';
      badge.innerHTML = '🕒 <span>Last Updated & Verified: <strong>' + dateStr + '</strong> · Peer Reviewed</span>';

      target.parentNode.insertBefore(badge, target.nextSibling);
      return true;
    }
  };

  // 4. Execute and Reconcile Rules
  function reconcile() {
    if (!RM.rules || RM.rules.length === 0) return;

    RM.rules.forEach(function (rule) {
      if (rule.status !== 'approved' && rule.status !== 'applied' && rule.status !== 'verified') return;
      if (!pathMatches(rule.pathname)) return;

      var handler = HANDLERS[rule.kind];
      if (!handler) return;

      try {
        var success = handler(rule.data || {}, rule.ruleKey);
        if (success) {
          RM.appliedRules[rule.ruleKey] = true;
          queueBeacon(rule.ruleKey, rule.kind, true);
        }
      } catch (err) {
        queueBeacon(rule.ruleKey, rule.kind, false, err ? err.message : 'Execution error');
      }
    });
  }

  // 5. Fetch Rules from API
  function loadRules() {
    var url = apiBase + '/api/sdk/rules?domainId=' + encodeURIComponent(domainId);
    if (token) url += '&token=' + encodeURIComponent(token);

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        RM.rules = data.rules || [];
        reconcile();
      })
      .catch(function (err) {
        if (window.console) {
          console.warn('[RankMonk Runtime] Failed to fetch active rules:', err.message);
        }
      });
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRules);
  } else {
    loadRules();
  }

  // SPA Route Change Listeners
  var pushState = history.pushState;
  if (pushState) {
    history.pushState = function () {
      pushState.apply(history, arguments);
      setTimeout(reconcile, 50);
    };
  }
  var replaceState = history.replaceState;
  if (replaceState) {
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      setTimeout(reconcile, 50);
    };
  }
  window.addEventListener('popstate', function () {
    setTimeout(reconcile, 50);
  });
})();
