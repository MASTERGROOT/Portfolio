<script>
  import { langStore } from './stores/lang.js';
  function toggle() {
    langStore.update(v => v === 'en' ? 'th' : 'en');
  }
</script>

<button on:click={toggle} aria-label="Toggle language" title="ภาษาไทย / EN">
  {#if $langStore === 'th'}TH{:else}EN{/if}
</button>

<style>
  button {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 100;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s;
  }
  button:hover { opacity: 1; }
</style>
