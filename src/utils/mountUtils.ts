import {
  backButton,
  miniApp,
  themeParams,
  swipeBehavior,
  initData,
} from "@telegram-apps/sdk-react";

let isMounted = false;
let cssVarsBound = false;

export function mountComponents() {
  if (isMounted) return;

  backButton.isSupported() && backButton.mount();
  miniApp.mount();
  themeParams.mount();
  swipeBehavior.mount();
  initData.restore();

  if (!cssVarsBound) {
    miniApp.bindCssVars();
    themeParams.bindCssVars();
    cssVarsBound = true;
  }

  isMounted = true;
}
