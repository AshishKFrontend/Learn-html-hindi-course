'use strict';

const CONFIG = {
    selectors: {
        editor: {
            container: '.live-editor',
            input: '.code-input',
            output: '.code-output'
        },
        sidebar: {
            links: '.sidebar ul li a',
            activeClass: 'active'
        },
        menu: {
            toggle: '#mobile-menu',
            links: '.nav-links',
            icon: '#mobile-menu i'
        },
        // Targetting all finish buttons
        finishButtons: ['#finish-btn-desktop', '#finish-btn-mobile', '.finish-btn-mobile']
    },
    storage: {
        statusDone: 'done'
    },
    ui: {
        icons: {
            copied: '<i class="fa-solid fa-check"></i> Copied!',
            completed: '<i class="fa-solid fa-circle-check" style="color: #22c55e; margin-right: 5px;"></i> '
        },
        timeout: 2000
    }
};

const AshishCodeLab = (() => {

    const EditorModule = {
        run: function(btn) {
            try {
                const editorContainer = btn.closest(CONFIG.selectors.editor.container);
                const codeInput = editorContainer.querySelector(CONFIG.selectors.editor.input).value;
                const outputFrame = editorContainer.querySelector(CONFIG.selectors.editor.output);
                const frameDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(codeInput);
                frameDoc.close();
            } catch (e) { console.error("Editor Error:", e); }
        },
        copy: function(btn) {
            try {
                const editorContainer = btn.closest(CONFIG.selectors.editor.container);
                const codeInput = editorContainer.querySelector(CONFIG.selectors.editor.input);
                codeInput.select();
                navigator.clipboard.writeText(codeInput.value);
                const originalText = btn.innerHTML;
                btn.innerHTML = CONFIG.ui.icons.copied;
                setTimeout(() => { btn.innerHTML = originalText; }, CONFIG.ui.timeout);
            } catch (e) { console.error("Copy Error:", e); }
        }
    };

    const ProgressModule = {
        // Precise file list for verification
        allFiles: [
            'ch1_intro.html', 'ch2_basic_tags.html', 'ch3_elements.html', 'ch4_attributes.html',
            'ch5_formatting.html', 'ch6_phrase_tags.html', 'ch7_meta_tags.html', 'ch8_comments.html',
            'ch9_images.html', 'ch10_tables.html', 'ch11_lists.html', 'ch12_text_links.html',
            'ch13_image_links.html', 'ch14_email_links.html', 'ch15_frames.html', 'ch16_iframes.html',
            'ch17_blocks.html', 'ch18_backgrounds.html', 'ch19_colors.html', 'ch20_fonts.html',
            'ch21_forms.html', 'ch22_multimedia.html', 'ch23_marquee.html', 'ch24_header.html',
            'ch25_css.html', 'ch26_javascript.html', 'ch27_layout.html', 'ch28_mouse_events.html',
            'ch29_window_events.html', 'ch30_form_events.html', 'ch31_hardware_events.html',
            'ch32_entities.html', 'ch33_url_encoding.html', 'ch34_lang_codes.html', 'ch35_char_sets.html',
            'ch36_http_status.html', 'ch37_mime_types.html', 'ch38_deprecated.html'
        ],

        init: function() {
            const currentPath = window.location.pathname;
            const pageName = currentPath.split("/").pop(); 

            if (pageName && pageName.startsWith("ch")) {
                localStorage.setItem(pageName, CONFIG.storage.statusDone);
            }

            this.updateSidebar(pageName);
            this.setupSecurity(pageName);
        },

        isCourseComplete: function() {
            return this.allFiles.every(file => localStorage.getItem(file) === CONFIG.storage.statusDone);
        },

        updateSidebar: function(currentPage) {
            const links = document.querySelectorAll(CONFIG.selectors.sidebar.links);
            links.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (localStorage.getItem(linkHref) === CONFIG.storage.statusDone) {
                    if (!link.innerHTML.includes("fa-circle-check")) {
                        link.innerHTML = CONFIG.ui.icons.completed + link.innerText;
                    }
                }
                if (linkHref === currentPage) link.classList.add(CONFIG.selectors.sidebar.activeClass);
            });
        },

        setupSecurity: function(pageName) {
            // Block direct access to certificate
            if (pageName === "congratulations.html") {
                if (!this.isCourseComplete()) {
                    alert("⚠️ Shama karein! Certificate ke liye saare 38 chapters padhna zaruri hai.");
                    window.location.href = "../index.html";
                }
            }

            // Lock Finish Buttons
            CONFIG.selectors.finishButtons.forEach(selector => {
                const btns = document.querySelectorAll(selector);
                btns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (!this.isCourseComplete()) {
                            e.preventDefault();
                            alert("🔒 Aapka course abhi incomplete hai. Kripya pehle pichle chapters poore karein!");
                        }
                    });
                });
            });
        }
    };

    const MobileMenuModule = {
        init: function() {
            const menuToggle = document.querySelector(CONFIG.selectors.menu.toggle);
            const navLinks = document.querySelector(CONFIG.selectors.menu.links);
            const icon = document.querySelector(CONFIG.selectors.menu.icon);

            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navLinks.classList.toggle('active');
                    if (icon) {
                        icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
                    }
                });
            }
        }
    };

    return {
        init: () => {
            ProgressModule.init();
            MobileMenuModule.init();
        },
        runCode: EditorModule.run,
        copyCode: EditorModule.copy
    };
})();
const handleGlobalTheme = () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    
    // Certificate page check
    if (window.location.pathname.includes('congratulations.html')) {
        body.classList.remove('dark-theme');
        return;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeBtn) themeBtn.querySelector('i').className = 'fa-solid fa-sun';
    }

    if (themeBtn) {
        themeBtn.onclick = () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeBtn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        };
    }
};

document.addEventListener('DOMContentLoaded', handleGlobalTheme);
document.addEventListener('DOMContentLoaded', AshishCodeLab.init);
window.runCode = AshishCodeLab.runCode;
window.copyCode = AshishCodeLab.copyCode;