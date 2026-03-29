#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    // Remembers window size and position between sessions.
    // No frontend code needed — the plugin hooks into OS window events directly.
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
