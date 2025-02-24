import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
  swipeBehavior,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // // unmount everything
  // backButton.unmount();
  // miniApp.unmount();
  // themeParams.unmount();
  // swipeBehavior.unmount();
  // viewport.unmount();

  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  backButton.isSupported() && backButton.mount();
  miniApp.mount();
  themeParams.mount();
  swipeBehavior.mount();
  initData.restore();
  void viewport
    .mount()
    .then(() => {
      // viewport.bindCssVars();
      // viewport.requestFullscreen();
      swipeBehavior.disableVertical();
    })
    .catch((e) => {
      console.error("Something went wrong mounting the viewport", e);
    });

  // Define components-related CSS variables.
  // miniApp.bindCssVars();
  // themeParams.bindCssVars();

  // Add Eruda if needed.
  debug &&
    import("eruda").then((lib) => lib.default.init()).catch(console.error);
}
