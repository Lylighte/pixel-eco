<script lang="ts" setup>
import { useData } from 'vitepress'
import BilibiliIcon from '../icons/BilibiliIcon.vue'
import GithubIcon from '../icons/GithubIcon.vue'
import QQIcon from '../icons/QQIcon.vue'

const { theme, site } = useData()

const iconMap: Record<string, unknown> = {
  github: GithubIcon,
  bilibili: BilibiliIcon,
  qq: QQIcon,
}

const iconNames: Record<string, string> = {
  github: 'GitHub',
  bilibili: 'Bilibili',
  qq: 'QQ',
}
</script>

<template>
  <div class="footer-area">
    <div class="footer-description">
      <p class="footer-name">{{ site.title || '像素生态' }}</p>
      <span>{{ site.description || '' }}</span>
      <span id="copyright" v-if="theme.footer?.copyright">
        {{ theme.footer.copyright }}
      </span>
      <span id="copyright" v-else>
        © {{ new Date().getFullYear() }} - 保留所有权利
      </span>
      <span id="declaration">
        主题 <a href="https://example.com" target="_blank" rel="noopener">Pixel Eco</a> 灵感来源于
        <a href="https://github.com/RandomLemon/neco" target="_blank" rel="noopener">neco</a>。感谢
        <span class="highlight-name">int15</span> 与 <span class="highlight-name">kingcq</span> 的贡献。
      </span>
      <!--
      <span id="declaration">
        NOT AN OFFICIAL MINECRAFT ORGANIZATION. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR
        MICROSOFT.
      </span>
      -->
      <!-- ICP备案 — 取消注释并填入备案号即可启用 -->
      <!--
      <span id="declaration">
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">皖ICP备2025XXXXXX号</a>
      </span>
      -->
    </div>

    <div class="footer-links">
      <div class="link-block" v-if="theme.socialLinks && theme.socialLinks.length">
        <p>链接</p>
        <a
          class="link-item"
          v-for="link in theme.socialLinks"
          :key="link.link"
          :href="link.link"
          target="_blank"
          rel="noopener"
        >
          <component :is="iconMap[link.icon]" class="link-icon" v-if="link.icon && iconMap[link.icon]" />
          {{ link.text || iconNames[link.icon] || link.link }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.footer-area {
  padding: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: var(--pixel-color-bg);
  border-top: 1px solid var(--pixel-footer-border);
  margin-top: 3rem;
  animation: fade-in-up 0.6s ease;
}

.footer-description {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  max-width: 40rem;
}

.footer-name {
  font-family: var(--pixel-font-heading);
  font-size: 1.25rem;   /* 20px — Ark Pixel 对齐 */
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  color: var(--pixel-footer-title);
}

.footer-description span {
  margin-bottom: 0.25rem;
  color: var(--pixel-footer-text);
}

#copyright {
  font-size: 0.9rem;
  color: var(--pixel-footer-copyright);
}

#declaration {
  font-size: 0.75rem;   /* 12px — 最小对齐尺寸 */
  color: var(--pixel-footer-declaration);
  margin-top: 0.15rem;
  margin-bottom: 0.15rem;
  line-height: 1.3;
}

.highlight-name {
  color: var(--pixel-brand-light);
}

#declaration a {
  color: var(--pixel-brand-light);
  text-decoration: underline;
  text-underline-offset: 2px;
}

#declaration a:hover {
  color: #fff;
}

.footer-links {
  margin-left: auto;
}

.link-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-block p {
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--pixel-color-text-muted);
  text-decoration: none;
}

.link-item:hover {
  color: var(--pixel-brand-light);
}

.link-icon {
  width: 1.2rem;
  height: 1.2rem;
}

@media screen and (max-width: 600px) {
  .footer-links {
    margin-left: 0;
    margin-top: 1rem;
  }
}
</style>
