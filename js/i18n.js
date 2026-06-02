// DECIPHER Website - i18n engine (KO default in HTML, EN override dictionary)
// Korean is the source of truth inline in the HTML. English lives here.
// Tag nodes with: data-i18n (textContent), data-i18n-html (innerHTML),
// data-i18n-attr="attr:key; attr2:key2". Toggle blocks with data-lang-show="ko|en".
(function () {
    'use strict';

    var STORAGE_KEY = 'decipher-lang';
    var SUPPORTED = ['ko', 'en'];
    var origin = new Map();   // node -> { text|html|attr originals }
    var lang = 'ko';

    // ---- English dictionary (keys are language-neutral; missing key falls back to Korean) ----
    var EN = {
        // shared
        'common.registered': 'Registered',
        'common.indev': 'In development',
        'common.viewlarger': 'View larger',
        'common.private': 'Private',
        'common.dataexport': 'Data export',
        'common.backproducts': '← View all products',

        // index — hero
        'idx.hero.desc': 'A series of forensic tools for securely analyzing iOS messenger data',
        'idx.hero.cta1': 'Explore Products',
        'idx.hero.cta2': 'Download iKakao →',
        'idx.pillar.ios': 'Dedicated platform',
        'idx.pillar.readonly': 'Forensic integrity',
        'idx.pillar.exe': 'Single executable',

        // index — products
        'idx.products.title': 'The DECIPHER Series',
        'idx.products.sub': 'Forensic tools for the iOS platform',
        'idx.ikakao.desc': 'Analyzes iOS KakaoTalk backup data. Supports both standard and open chats, and recovers deleted messages from residual data.',
        'idx.ikakao.f1': 'Standard & open chat analysis',
        'idx.ikakao.f2': 'Deleted message recovery',
        'idx.ikakao.f3': 'Image & media recovery',
        'idx.ikakao.f4': 'iTunes encrypted backup support',
        'idx.ikakao.more': 'Learn more',
        'idx.iline.desc': 'Analyzes iOS LINE messenger backup data. Forensically extracts chats, groups, and media files.',
        'idx.iline.f1': '1:1 & group chat analysis',
        'idx.iline.f2': 'Sticker & media recovery',
        'idx.iline.f3': 'Timeline reconstruction',
        'idx.itg.desc': 'Analyzes iOS Telegram backup data. Forensically processes secret chats, standard chats, and channel data.',
        'idx.itg.f1': 'Standard & secret chat analysis',
        'idx.itg.f2': 'Channel & group data extraction',
        'idx.itg.f3': 'Media & file recovery',

        // index — features
        'idx.feat.title': 'Why DECIPHER?',
        'idx.feat.sub': 'Reliable tools built for forensic professionals',
        'idx.feat.1.h': 'Forensic Integrity',
        'idx.feat.1.d': 'Read-only analysis that never alters the original data. Hash verification ensures evidence preservation.',
        'idx.feat.2.h': 'Encrypted Backup Support',
        'idx.feat.2.d': 'Enter the backup password and iTunes encrypted backups are automatically decrypted and analyzed.',
        'idx.feat.3.h': 'Deleted Message Recovery',
        'idx.feat.3.d': 'Precisely distinguishes "Delete for me" from "Delete for everyone," and recovers deleted messages from residual data.',
        'idx.feat.4.h': 'Media Recovery',
        'idx.feat.4.d': 'Automatically locates and maps images and videos in chats, with original-image previews.',
        'idx.feat.5.h': 'Intuitive Interface',
        'idx.feat.5.d': 'Analyze naturally with a UI resembling the original messenger. Real-time progress, search, and filtering included.',
        'idx.feat.6.h': 'Standalone Execution',
        'idx.feat.6.d': 'Runs directly from a single executable with no installation. Results are safely stored in a standalone database.',

        // index — how it works
        'idx.howto.title': 'Three Simple Steps',
        'idx.howto.1.h': 'Select Backup',
        'idx.howto.1.d': 'Select an iTunes backup folder. For encrypted backups, enter the password.',
        'idx.howto.2.h': 'Automatic Analysis',
        'idx.howto.2.d': 'DECIPHER automatically extracts and analyzes the data.',
        'idx.howto.3.h': 'Review Results',
        'idx.howto.3.d': 'Review messages, media, and metadata in the UI.',

        // index/ikakao — certification
        'idx.cert.title': 'Official Registration & Patent Filing',
        'idx.cert.sub': 'Technical originality certified through Korea Copyright Commission registration and a Korean patent filing.',
        'cert.copyright.h': 'Copyright Registration Certificate',
        'cert.copyright.alt': 'Copyright registration certificate',
        'cert.patent.h': 'Patent Application',
        'cert.patent.alt': 'Patent filing notice',
        'cert.regno.label': 'Reg. No.',
        'cert.program.label': 'Program',
        'cert.type.label': 'Type',
        'cert.type.val': 'Computer Program Work',
        'cert.author.label': 'Author',
        'cert.regdate.label': 'Reg. Date',
        'cert.issuer.label': 'Issued by',
        'cert.issuer.kcc': 'Korea Copyright Commission',
        'cert.appno.label': 'App. No.',
        'cert.invtitle.label': 'Title of Invention',
        'cert.invtitle.val': 'Method for decrypting KakaoTalk open chats and recovering deleted data based on the iOS Keychain and SQLCipher',
        'cert.applicant.label': 'Applicant',
        'cert.filedate.label': 'Filing Date',
        'cert.examdate.label': 'Exam Request Date',
        'cert.kipo': 'KIPO (Korea)',

        // index — roadmap
        'idx.roadmap.title': 'Development Roadmap',
        'idx.roadmap.sub': 'Expansion plan for the DECIPHER series',
        'idx.roadmap.ikakao': 'KakaoTalk forensic tool — standard chats, open chats, image recovery, and deleted-message analysis.',
        'idx.roadmap.iline': 'LINE messenger forensic tool — 1:1 chats, groups, stickers, and media analysis.',
        'idx.roadmap.itg': 'Telegram forensic tool — standard chats, secret chats, and channel-data analysis.',
        'idx.roadmap.more': 'More iOS messenger forensic tools — such as iSignal and iWeChat — are planned.',

        // index — CTA / footer / meta
        'idx.cta.title': 'Get Started Now',
        'idx.cta.desc': 'Experience iOS KakaoTalk data analysis with DECIPHER iKakao.<br>A single executable — no extra software to install.',
        'idx.cta.dl': 'Download iKakao',
        'idx.cta.all': 'View all products',
        'idx.meta.desc': 'DECIPHER — a series of iOS messenger forensic tools: iKakao, iLine, iTelegram.',

        // ikakao — hero
        'ik.hero.h2': 'iOS KakaoTalk data,<br><span class="text-kakao">precisely analyzed</span>.',
        'ik.hero.desc': 'Extracts and analyzes KakaoTalk messages from iTunes backups. Standard chats, open chats, deleted messages, and images — analyzing key data while preserving forensic integrity.',
        'ik.tag.general': 'Standard Chat',
        'ik.tag.open': 'Open Chat',
        'ik.tag.deleted': 'Deleted Messages',
        'ik.tag.image': 'Image Recovery',
        'ik.tag.backup': 'iTunes Backup',
        'ik.tag.export': 'SQLite Export',
        'ik.hero.dl': 'Download',
        'ik.hero.feat': 'View Features →',

        // ikakao — mockup
        'ik.mock.u1': 'John Doe · 2026.02.21 14:32',
        'ik.mock.m1': 'Hi! Please confirm tomorrow’s meeting time.',
        'ik.mock.u2': 'Me · 2026.02.21 14:33',
        'ik.mock.m2': 'Sure, let’s meet at 3 PM! 📋',
        'ik.mock.u3': 'Jane Doe · 2026.02.21 15:01',
        'ik.mock.deleted': ' A deleted message was recovered',
        'ik.mock.u4': 'John Doe · 2026.02.21 15:15',

        // ikakao — features tabs
        'ik.feat.title': 'Key Features',
        'ik.tab.media': 'Media & Images',
        'ik.tab.analysis': 'Analysis & Export',
        'ik.g1.h': 'Message Analysis',
        'ik.g1.d': 'Extracts and analyzes all chat messages from Message.sqlite and Talk.sqlite.',
        'ik.g2.h': 'Deleted Message Recovery',
        'ik.g2.d': 'Precisely distinguishes "Delete for me" from "Delete for everyone," and recovers deleted messages from residual data.',
        'ik.g3.h': 'User ID Mapping',
        'ik.g3.d': 'Cross-references the friends database to map user IDs to real names.',
        'ik.g4.h': 'Encrypted Backup Support',
        'ik.g4.d': 'Automatically handles both encrypted and unencrypted iTunes backups. Open-chat decryption requires an encrypted backup that includes the Keychain.',
        'ik.o1.h': 'Open Chat Analysis',
        'ik.o1.d': 'Analyzes the separately encrypted OpenChatMessage.sqlite database.',
        'ik.o2.h': 'Keychain Extraction',
        'ik.o2.d': 'Automatically extracts the keys needed for open-chat analysis from the iOS Keychain.',
        'ik.o3.h': 'Conversation Events',
        'ik.o3.d': 'Shows conversation events — joins, leaves, kicks, and invites — alongside user names.',
        'ik.o4.h': 'DB Join Analysis',
        'ik.o4.d': 'Automatically interprets and links the complex relationships in the open-chat database.',
        'ik.m1.h': 'Automatic Image Mapping',
        'ik.m1.d': 'Automatically maps image files to their source messages (attachment records) and displays them.',
        'ik.m2.h': 'Image Viewer',
        'ik.m2.d': 'Provides thumbnail previews and a full-size image viewer.',
        'ik.m3.h': 'Chat Directory Reconstruction',
        'ik.m3.d': 'Interprets the backup structure from Manifest.db and reconstructs chat directories.',
        'ik.m4.h': 'Diverse Message Types',
        'ik.m4.d': 'Handles all message types — photos, videos, voice, location, contacts, emoticons, and more.',
        'ik.a1.h': 'Powerful Search',
        'ik.a1.d': 'Search messages, chat rooms, and friends — with highlighting and debounced, responsive queries.',
        'ik.a2.h': 'Parse-Failure Inspection',
        'ik.a2.d': 'Organizes and displays messages that failed to parse, grouped by chat room.',
        'ik.a3.h': 'SQLite Export',
        'ik.a3.d': 'Exports results to a standalone SQLite database for safekeeping.',
        'ik.a4.h': 'Timeline Reconstruction',
        'ik.a4.d': 'Reconstructs a chronological timeline of conversations with advanced search filtering.',

        // ikakao — certification strip
        'ik.cert.kcc.h': 'Officially Registered with the Korea Copyright Commission',
        'ik.cert.kcc.d': 'DECIPHER-iKakao is officially registered as a computer program work.',
        'ik.cert.regno_line': "Reg. No. <span class='text-gray-500'>Private</span>",
        'ik.cert.regdate_line': "Reg. Date <span class='text-gray-300'>2026.02.26</span>",
        'ik.cert.author_line': "Author <span class='text-gray-500'>Private</span>",
        'ik.cert.patent.h': 'Patent Application — Core iKakao Technology',
        'ik.cert.patent.badge': 'Filed',
        'ik.cert.appno_line': "App. No. <span class='text-gray-500'>Private</span>",
        'ik.cert.filedate_line': "Filing Date <span class='text-gray-300'>2026.03.27</span>",
        'ik.cert.applicant_line': "Applicant <span class='text-gray-500'>Private</span>",

        // ikakao — download
        'ik.dl.sub': 'Windows only. A single executable — no separate installation required.',
        'ik.dl.sysreq': 'System Requirements',
        'ik.dl.req2': 'iTunes installed (for backups)',
        'ik.dl.req3': 'iOS device backup file',
        'ik.dl.btn.zip': 'Download DECIPHER-iKakao (ZIP)',
        'ik.dl.btn.pdf': 'Download User Guide (PDF)',
        'ik.dl.ver': 'v1.0 · Windows · Single EXE (ZIP)',
        'ik.dl.install.h': '⚠️ Installation Notes',
        'ik.dl.install.1': 'Download the ZIP and extract it.',
        'ik.dl.install.2': "If a \"Windows protected your PC\" warning appears, click <span class='text-gray-300'>More info → Run</span>.",
        'ik.dl.en.btn.zip': 'Download DECIPHER-iKakao (EN)',
        'ik.dl.en.btn.pdf': 'English User Guide (PDF)',
        'ik.dl.en.soon': 'The English user guide (PDF) is in preparation. The tool above is ready to download.',

        // iline / itelegram
        'il.desc': 'A forensic tool for analyzing iOS LINE messenger backup data.<br>Forensically extracts 1:1 chats, groups, stickers, and media files.',
        'il.f1': '1:1 & group chats',
        'il.f2': 'Stickers & media',
        'il.f3': 'Conversation timeline',
        'it.desc': 'A forensic tool for analyzing iOS Telegram messenger backup data.<br>Forensically extracts standard chats, secret chats, and channel data.',
        'it.f1': 'Standard & secret chats',
        'it.f2': 'Channels & groups',
        'it.f3': 'Media & files'
    };

    function store(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { } }
    function read() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }

    function applyOne(el) {
        var k = el.getAttribute('data-i18n');
        if (k) {
            if (!origin.has(el)) origin.set(el, { t: el.textContent });
            el.textContent = (lang === 'en' && EN[k] != null) ? EN[k] : origin.get(el).t;
        }
        var hk = el.getAttribute('data-i18n-html');
        if (hk) {
            if (!origin.has(el)) origin.set(el, { h: el.innerHTML });
            el.innerHTML = (lang === 'en' && EN[hk] != null) ? EN[hk] : origin.get(el).h;
        }
        var ak = el.getAttribute('data-i18n-attr');
        if (ak) {
            var rec = origin.get(el) || {};
            ak.split(';').forEach(function (pair) {
                var p = pair.split(':');
                var attr = (p[0] || '').trim(), key = (p[1] || '').trim();
                if (!attr || !key) return;
                var ok = 'a_' + attr;
                if (rec[ok] == null) rec[ok] = el.getAttribute(attr) || '';
                el.setAttribute(attr, (lang === 'en' && EN[key] != null) ? EN[key] : rec[ok]);
            });
            origin.set(el, rec);
        }
    }

    function apply(next, persist) {
        lang = (SUPPORTED.indexOf(next) >= 0) ? next : 'ko';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);
        document.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]').forEach(applyOne);
        document.querySelectorAll('[data-lang-show]').forEach(function (el) {
            el.style.display = (el.getAttribute('data-lang-show') === lang) ? '' : 'none';
        });
        document.querySelectorAll('[data-set-lang]').forEach(function (b) {
            var on = b.getAttribute('data-set-lang') === lang;
            b.classList.toggle('text-cyber', on);
            b.classList.toggle('text-gray-500', !on);
        });
        if (persist !== false) store(lang);
        document.documentElement.classList.remove('i18n-pending');
    }

    function showChooser() {
        if (document.getElementById('langChooser')) return;
        var o = document.createElement('div');
        o.id = 'langChooser';
        o.setAttribute('style', 'position:fixed;inset:0;z-index:200;background:rgba(10,22,40,0.97);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;');
        o.innerHTML =
            '<div style="text-align:center;padding:2rem;">' +
            '<div class="font-display font-black text-4xl mb-2"><span class="text-cyber">DECI</span><span class="text-white">PHER</span></div>' +
            '<p class="text-gray-400 text-sm mb-8">Select language &middot; 언어 선택</p>' +
            '<div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">' +
            '<button type="button" data-choose="ko" class="px-8 py-3 rounded-xl border border-white/20 text-white hover:border-cyber/60 hover:text-cyber transition-all">한국어</button>' +
            '<button type="button" data-choose="en" class="px-8 py-3 rounded-xl border border-white/20 text-white hover:border-cyber/60 hover:text-cyber transition-all">English</button>' +
            '</div></div>';
        o.addEventListener('click', function (e) {
            var b = e.target.closest('[data-choose]');
            if (!b) return;
            apply(b.getAttribute('data-choose'), true);
            o.remove();
        });
        document.body.appendChild(o);
    }

    function wireToggle() {
        document.querySelectorAll('[data-set-lang]').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.getAttribute('data-set-lang'), true); });
        });
    }

    function init() {
        var stored = read();
        wireToggle();
        if (stored && SUPPORTED.indexOf(stored) >= 0) {
            apply(stored, false);
        } else {
            apply('ko', false);   // cache originals + sync UI, do not persist
            showChooser();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
