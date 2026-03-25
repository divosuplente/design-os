/**
 * Shell loading and parsing utilities
 */

import type { ShellSpec, ShellInfo, ShellArtifactInfo } from '@/types/product'
import type { DesignFileExtension, DesignPlatform } from '@/types/platform'

type DesignModuleLoader = () => Promise<{ default: unknown }>

// Load shell spec markdown file at build time
const shellSpecFiles = import.meta.glob('/product/shell/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load shell components lazily (React, Svelte, Astro)
const shellComponentModules = import.meta.glob([
  '/src/shell/components/*.tsx',
  '/src/shell/components/*.svelte',
  '/src/shell/components/*.astro',
]) as Record<string, DesignModuleLoader>

// Load shell preview wrappers lazily (React, Svelte, Astro)
const shellPreviewModules = import.meta.glob([
  '/src/shell/*.tsx',
  '/src/shell/*.svelte',
  '/src/shell/*.astro',
]) as Record<string, DesignModuleLoader>

const EXTENSION_TO_PLATFORM: Record<DesignFileExtension, DesignPlatform> = {
  tsx: 'react',
  svelte: 'svelte',
  astro: 'astro',
}

const EXTENSION_PRIORITY: DesignFileExtension[] = ['astro', 'svelte', 'tsx']

function getExtensionPriority(extension: DesignFileExtension): number {
  const index = EXTENSION_PRIORITY.indexOf(extension)
  return index === -1 ? EXTENSION_PRIORITY.length : index
}

function extractShellArtifact(path: string): ShellArtifactInfo | null {
  const match = path.match(/\/src\/shell(?:\/components)?\/([^/.]+)\.(tsx|svelte|astro)$/)
  if (!match) return null
  const extension = match[2] as DesignFileExtension
  return {
    name: match[1],
    path,
    extension,
    platform: EXTENSION_TO_PLATFORM[extension],
  }
}

function chooseByPriority(
  artifacts: ShellArtifactInfo[],
  preferredPlatform?: DesignPlatform,
): ShellArtifactInfo | null {
  const candidates = preferredPlatform
    ? artifacts.filter((artifact) => artifact.platform === preferredPlatform)
    : artifacts
  if (candidates.length === 0) return null
  return candidates.sort((a, b) => {
    return getExtensionPriority(a.extension) - getExtensionPriority(b.extension)
  })[0]
}

function getShellComponentArtifactsByName(componentName: string): ShellArtifactInfo[] {
  const artifacts: ShellArtifactInfo[] = []
  for (const path of Object.keys(shellComponentModules)) {
    const artifact = extractShellArtifact(path)
    if (artifact?.name === componentName) {
      artifacts.push(artifact)
    }
  }
  return artifacts
}

function getShellPreviewArtifactsByName(componentName: string): ShellArtifactInfo[] {
  const artifacts: ShellArtifactInfo[] = []
  for (const path of Object.keys(shellPreviewModules)) {
    const artifact = extractShellArtifact(path)
    if (artifact?.name === componentName) {
      artifacts.push(artifact)
    }
  }
  return artifacts
}

/**
 * Parse shell spec.md content into ShellSpec structure
 *
 * Expected format:
 * # Application Shell Specification
 *
 * ## Overview
 * Description of the shell design
 *
 * ## Navigation Structure
 * - Nav Item 1 → Section
 * - Nav Item 2 → Section
 *
 * ## Layout Pattern
 * Description of layout (sidebar, top nav, etc.)
 */
export function parseShellSpec(md: string): ShellSpec | null {
  if (!md || !md.trim()) return null

  try {
    // Extract overview
    const overviewMatch = md.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    // Extract navigation items
    const navSection = md.match(/## Navigation Structure\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const navigationItems: string[] = []

    if (navSection?.[1]) {
      const lines = navSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          navigationItems.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract layout pattern
    const layoutMatch = md.match(/## Layout Pattern\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const layoutPattern = layoutMatch?.[1]?.trim() || ''

    // Return null if we couldn't parse anything meaningful
    if (!overview && navigationItems.length === 0 && !layoutPattern) {
      return null
    }

    return {
      raw: md,
      overview,
      navigationItems,
      layoutPattern,
    }
  } catch {
    return null
  }
}

/**
 * Get shell wrapper artifact (prefers ShellWrapper, falls back to AppShell)
 * When preferredPlatform is provided, only same-platform wrappers are returned.
 */
export function getShellWrapperArtifact(preferredPlatform?: DesignPlatform): ShellArtifactInfo | null {
  const shellWrapper = chooseByPriority(
    getShellComponentArtifactsByName('ShellWrapper'),
    preferredPlatform,
  )
  if (shellWrapper) return shellWrapper
  return chooseByPriority(getShellComponentArtifactsByName('AppShell'), preferredPlatform)
}

/**
 * Get shell preview artifact (ShellPreview.{tsx|svelte|astro})
 * When preferredPlatform is provided, only same-platform previews are returned.
 */
export function getShellPreviewArtifact(preferredPlatform?: DesignPlatform): ShellArtifactInfo | null {
  return chooseByPriority(getShellPreviewArtifactsByName('ShellPreview'), preferredPlatform)
}

/**
 * Check if shell components exist
 */
export function hasShellComponents(): boolean {
  return getShellWrapperArtifact() !== null
}

/**
 * Load shell component dynamically
 */
export function loadShellComponent(
  componentName: string,
  preferredPlatform?: DesignPlatform,
): DesignModuleLoader | null {
  const artifact = chooseByPriority(
    getShellComponentArtifactsByName(componentName),
    preferredPlatform,
  )
  if (!artifact) return null
  return shellComponentModules[artifact.path] || null
}

/**
 * Load shell wrapper module dynamically
 */
export function loadShellWrapperModule(preferredPlatform?: DesignPlatform): DesignModuleLoader | null {
  const artifact = getShellWrapperArtifact(preferredPlatform)
  if (!artifact) return null
  return shellComponentModules[artifact.path] || null
}

/**
 * Load shell preview wrapper module dynamically
 */
export function loadShellPreviewModule(preferredPlatform?: DesignPlatform): DesignModuleLoader | null {
  const artifact = getShellPreviewArtifact(preferredPlatform)
  if (!artifact) return null
  return shellPreviewModules[artifact.path] || null
}

/**
 * Load the complete shell info
 */
export function loadShellInfo(): ShellInfo | null {
  const specContent = shellSpecFiles['/product/shell/spec.md']
  const spec = specContent ? parseShellSpec(specContent) : null
  const wrapper = getShellWrapperArtifact()
  const preview = getShellPreviewArtifact()
  const hasComponents = wrapper !== null

  // Return null if neither spec nor components exist
  if (!spec && !hasComponents) {
    return null
  }

  return { spec, hasComponents, preview, wrapper }
}

/**
 * Check if shell has been defined (spec or components)
 */
export function hasShell(): boolean {
  return hasShellSpec() || hasShellComponents()
}

/**
 * Check if shell spec has been defined
 */
export function hasShellSpec(): boolean {
  return '/product/shell/spec.md' in shellSpecFiles
}

/**
 * Get list of shell component names
 */
export function getShellComponentNames(): string[] {
  const names = new Set<string>()
  for (const path of Object.keys(shellComponentModules)) {
    const artifact = extractShellArtifact(path)
    if (artifact) names.add(artifact.name)
  }
  return Array.from(names).sort()
}
