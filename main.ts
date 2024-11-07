import { App, Plugin, PluginManifest } from "obsidian";
import langs, { Lang }  from './lang'

const hideenClass = "plugin-simple-focus-hidden";

class SimpleFocusPlugin extends Plugin {
  isFocus: boolean;
  lang: Lang;
  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    const obsidianLangName = window.localStorage.getItem('language')
    const langName = obsidianLangName === 'zh' ? 'zh' : 'en';
    this.lang = langs[langName]
    this.isFocus = false;
  }
  onload() {
    this.addFileMenuItem();
    this.addHotkey();
  }
  addHotkey() {
    this.addCommand({
      id: "simple-focus-exit-focus",
      name: this.lang.exitFocus,
      callback: () => {
        this.exitFocus()
      },
    });
    this.addCommand({
      id: "simple-focus-enter-focus",
      name: this.lang.enterFocus,
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if(file?.path) {
          this.enterFocus(file.path)
        }
      },
    });
  }

  addFileMenuItem() {
    return new Promise((resolve) => {
      this.registerEvent(
        this.app.workspace.on("file-menu", (menu, file) => {
          menu.addItem((item) => {
            item
              .setTitle(this.isFocus ?  this.lang.exitFocus : this.lang.focus)
              .setIcon(this.isFocus ? "log-out" : "focus")
              .onClick(async () => {
                this.toggleFocus(file?.path);
              });
          });
          resolve(menu);
        })
      );
    });
  }

  toggleFocus(path: string) {
    if (this.isFocus) {
      this.exitFocus();
    } else {
      this.enterFocus(path);
    }
  }

  enterFocus(path: string) {
    this.isFocus = true;
    const hiddenEls = document.querySelectorAll<HTMLElement>(
      `.tree-item:not(:has([data-path="${path}"]),:has([data-path^="${path}/"]))`
    );
    hiddenEls.forEach((hiddenEl) => {
      hiddenEl.addClass(hideenClass);
    });
  }

  exitFocus() {
    this.isFocus = false;

    const unFocusEls = document.querySelectorAll<HTMLElement>(
      `.${hideenClass}`
    );

    unFocusEls.forEach((unFocusEl) => {
      unFocusEl.removeClass(hideenClass);
    });
  }
}

export default SimpleFocusPlugin;
