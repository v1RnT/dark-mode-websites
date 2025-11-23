<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";

  const sites = [
    { id: "udemy.com", name: "Udemy" },
    { id: "google.com", name: "Google" },
  ];

  let settings: Record<string, boolean> = {};

  onMount(() => {
    const keys = sites.map((s) => s.id);

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(keys, (result) => {
        settings = result;
      });
    }
  });

  function toggleSite(siteId: string) {
    settings[siteId] = !settings[siteId];

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ [siteId]: settings[siteId] });
    }
  }
</script>

<main class="w-[300px] bg-slate-900">
  <div
    class="flex items-center mx-4 pt-2 justify-between mb-6"
  >
    <h1 class="text-lg font-bold text-blue-400">Dark Mode Manager</h1>
    <span class="text-xs text-blue-200"
      >v1.0</span
    >
  </div>

  <div class="mx-4 pb-4 space-y-3">
    {#each sites as site}
      <div
      >
        <span class="font-medium text-slate-200">{site.name}</span>

        <button
          on:click={() => toggleSite(site.id)}
          class="relative w-10 h-6 ml-3 focus:ring-blue-500"
          class:bg-blue-500={settings[site.id]}
          class:bg-slate-600={!settings[site.id]}
          aria-label="Toggle dark mode for {site.name}"
          title="Toggle dark mode for {site.name}"
        >
          <span
            class:translate-x-5={settings[site.id]}
          ></span>
        </button>
      </div>
    {/each}
  </div>

</main>
