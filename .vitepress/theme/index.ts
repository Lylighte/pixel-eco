import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'

// VitePress default content styles (code blocks, tables, etc.)
import 'vitepress/theme'

// Custom styles
import './styles/vars.css'
import './styles/fonts.css'
import './styles/animations.css'
import './styles/pixel-border.css'

// UI Components
import PixelButton from './components/ui/PixelButton.vue'
import PixelButtonClassic from './components/ui/PixelButtonClassic.vue'
import PixelButton3D from './components/ui/PixelButton3D.vue'
import PixelInput from './components/ui/PixelInput.vue'
import PixelTextarea from './components/ui/PixelTextarea.vue'
import PixelDialog from './components/ui/PixelDialog.vue'
import PixelBadge from './components/ui/PixelBadge.vue'
import PixelCard from './components/ui/PixelCard.vue'
import PixelTooltip from './components/ui/PixelTooltip.vue'
import PixelAccordion from './components/ui/PixelAccordion.vue'
import PixelTabs from './components/ui/PixelTabs.vue'
import ScrollToTop from './components/layout/ScrollToTop.vue'

// Layout Components
import HomeHero from './components/layout/HomeHero.vue'
import HomeIntro from './components/layout/HomeIntro.vue'
import NewsCard from './components/content/NewsCard.vue'
import LinkCard from './components/content/LinkCard.vue'
import DocsSidebar from './components/content/DocsSidebar.vue'
import SiteFooter from './components/layout/SiteFooter.vue'

export default {
  Layout,
  enhanceApp({ app }) {
    // Register all Pixel UI components globally
    app.component('PixelButton', PixelButton)
    app.component('PixelButtonClassic', PixelButtonClassic)
    app.component('PixelButton3D', PixelButton3D)
    app.component('PixelInput', PixelInput)
    app.component('PixelTextarea', PixelTextarea)
    app.component('PixelDialog', PixelDialog)
    app.component('PixelBadge', PixelBadge)
    app.component('PixelCard', PixelCard)
    app.component('PixelTooltip', PixelTooltip)
    app.component('PixelAccordion', PixelAccordion)
    app.component('PixelTabs', PixelTabs)
    app.component('ScrollToTop', ScrollToTop)

    // Register layout components for use in Markdown
    app.component('HomeHero', HomeHero)
    app.component('HomeIntro', HomeIntro)
    app.component('NewsCard', NewsCard)
    app.component('LinkCard', LinkCard)
    app.component('DocsSidebar', DocsSidebar)
    app.component('SiteFooter', SiteFooter)
  },
} satisfies Theme
