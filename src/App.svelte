<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";

  const sites = [
    { id: "udemy.com", name: "Udemy" },
    { id: "google.com", name: "Google" },
  ];

  let settings: Record<string, boolean> = sites.reduce(
    (acc, site) => {
      acc[site.id] = false;
      return acc;
    },
    {} as Record<string, boolean>
  );

  let errorMessage: string | null = null;

  onMount(() => {
    const keys = sites.map((s) => s.id);

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(keys, (result) => {
        if (chrome.runtime.lastError) {
          console.error("Storage read error:", chrome.runtime.lastError);
          errorMessage = "Could not load settings.";
          return;
        }

        const newSettings: Record<string, boolean> = { ...settings };
        keys.forEach((key) => {
          newSettings[key] = (result[key] as boolean) ?? false;
        });

        settings = newSettings;
      });
    }
  });

  function toggleSite(siteId: string) {
    const previousState = settings[siteId];

    settings[siteId] = !settings[siteId];
    errorMessage = null;

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ [siteId]: settings[siteId] }, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage write error:", chrome.runtime.lastError);

          settings[siteId] = previousState;
          errorMessage = "Failed to save. Storage might be full or disabled.";
        }
      });
    }
  }
</script>

<main class="w-[300px] bg-slate-900 text-white min-h-[200px] p-4 font-sans">
  <div
    class="flex items-center justify-between mb-6 border-b border-slate-700 pb-2"
  >
    <h1 class="text-lg font-bold text-blue-400">Dark Mode Manager</h1>
    <span class="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded"
      >v1.0</span
    >
  </div>

  {#if errorMessage}
    <div
      class="mb-4 p-2 text-xs bg-red-900/50 border border-red-700 text-red-200 rounded text-center animate-pulse"
    >
      {errorMessage}
    </div>
  {/if}

  <div class="space-y-3">
    {#each sites as site}
      <div
        class="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
      >
        <span class="font-medium text-slate-200">{site.name}</span>

        <button
          on:click={() => toggleSite(site.id)}
          class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          class:bg-blue-500={settings[site.id]}
          class:bg-slate-600={!settings[site.id]}
          aria-label="Toggle dark mode for {site.name}"
          title="Toggle dark mode for {site.name}"
        >
          <span
            class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform"
            class:translate-x-5={settings[site.id]}
          ></span>
        </button>
      </div>
    {/each}
  </div>

  <div class="mt-6 text-xs text-slate-500 text-center">
    Settings sync across your Chrome devices.
  </div>
</main>
