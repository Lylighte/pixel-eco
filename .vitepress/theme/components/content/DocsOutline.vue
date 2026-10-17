<script setup lang="ts">
import { computed, nextTick, onMounted, ref, toRef, watch } from 'vue'
import { useData } from 'vitepress'
import DocsOutlineItem from './DocsOutlineItem.vue'
import { resolveOutline, type OutlineSetting } from '../../utils/docs-outline'
import { useDocsOutline } from '../../composables/useDocsOutline'
import { useClickSound } from '../../composables/useClickSound'

const props = defineProps<{ contentReady: boolean }>()
const { page, frontmatter, theme } = useData()
const outline = computed(() =>
  resolveOutline(
    page.value.headers,
    (frontmatter.value.outline ?? theme.value.outline ?? [1, 6]) as OutlineSetting,
    Array.isArray(frontmatter.value.outlineExclude) ? frontmatter.value.outlineExclude : [],
  ),
)
const headers = computed(() => outline.value.headers)
const { activeSlug } = useDocsOutline(headers, toRef(props, 'contentReady'), 'docs-content')
const { playSound } = useClickSound()
const expanded = ref(true)
const interactive = ref(false)
const links = ref<HTMLElement | null>(null)

onMounted(() => {
  interactive.value = true
})

function toggle() {
  expanded.value = !expanded.value
  playSound()
}

watch(activeSlug, async () => {
  await nextTick()
  const container = links.value
  const current = container?.querySelector<HTMLElement>('[aria-current="location"]')
  if (!container || !current || !container.clientHeight) return
  const bounds = container.getBoundingClientRect()
  const item = current.getBoundingClientRect()
  // Scroll only the directory; scrollIntoView could also move the document.
  if (item.top < bounds.top) container.scrollTop += item.top - bounds.top
  else if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom
})
</script>

<template>
  <nav
    v-if="headers.length"
    class="docs-outline"
    :class="{ 'is-collapsed': !expanded }"
    :aria-label="outline.label"
    data-pagefind-ignore
  >
    <div class="outline-heading">
      <span>{{ outline.label }}</span>
      <button
        v-if="interactive"
        type="button"
        class="outline-toggle"
        :aria-expanded="expanded"
        aria-controls="docs-outline-links"
        @click="toggle"
      >
        {{ expanded ? '收起' : '展开' }}
      </button>
    </div>
    <div id="docs-outline-links" ref="links" class="outline-links">
      <DocsOutlineItem :headers="headers" :active-slug="activeSlug" @activate="playSound()" />
    </div>
  </nav>
</template>

<style scoped>
.docs-outline {
  min-width: 0;
  margin: var(--pixel-space-l) 1.5rem 0;
  padding: var(--pixel-space-m) 0;
  border: var(--pixel-sidebar-border);
  background: var(--pixel-sidebar-bg);
  align-self: start;
}

.outline-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pixel-space-m);
  padding: 0 0.75rem 0.75rem;
  margin-bottom: var(--pixel-space-s);
  border-bottom: 1px solid var(--pixel-gray);
  font-family: var(--pixel-font-heading);
  color: var(--pixel-brand-light);
  letter-spacing: 1px;
}

.outline-toggle {
  border: var(--pixel-border);
  background: var(--pixel-color-bg);
  color: var(--pixel-color-text);
  padding: 0.25rem 0.5rem;
  font: inherit;
  cursor: pointer;
}

.outline-links {
  max-height: 50vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding: 0.25rem;
}

.is-collapsed .outline-links {
  display: none;
}

@media screen and (min-width: var(--pixel-break-outline)) {
  .docs-outline {
    position: sticky;
    top: calc(var(--pixel-nav-height) + var(--pixel-space-l));
    margin: var(--pixel-space-l) 0 0;
    max-height: calc(100dvh - var(--pixel-nav-height) - var(--pixel-space-l) - 1rem);
    display: flex;
    flex-direction: column;
    border: none;
    border-left: var(--pixel-sidebar-border);
    background: transparent;
  }

  .outline-links,
  .is-collapsed .outline-links {
    display: block;
    min-height: 0;
    max-height: none;
  }

  .outline-toggle {
    display: none;
  }
}
</style>
