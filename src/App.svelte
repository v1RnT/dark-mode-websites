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

<main class="w-[300px] bg-slate-900">
  <div class="flex items-center mx-4 pt-2 justify-between mb-6">
    <h1 class="text-lg font-bold text-blue-400">Dark Mode Websites</h1>
    <span class="text-xs text-blue-200">v1.0</span>
  </div>

  {#if errorMessage}
    <div class="mb-4 p-2 text-xs bg-red-900 text-red-200 text-center">
      {errorMessage}
    </div>
  {/if}

  <div class="mx-4 pb-4 space-y-3">
    {#each sites as site}
      <div>
        <span class="font-medium text-slate-200">{site.name}</span>

        <button
          on:click={() => toggleSite(site.id)}
          class="relative w-10 h-6 ml-3 focus:ring-blue-500"
          class:bg-blue-500={settings[site.id]}
          class:bg-slate-600={!settings[site.id]}
          aria-label="Toggle dark mode for {site.name}"
          title="Toggle dark mode for {site.name}"
        >
          <span class:translate-x-5={settings[site.id]}></span>
        </button>
      </div>
    {/each}
  </div>
</main>
