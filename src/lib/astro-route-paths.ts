import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DesignFileExtension } from '@/types/platform'

const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url))
const PRODUCT_SECTIONS_DIR = path.join(PROJECT_ROOT, 'product', 'sections')
const SRC_SECTIONS_DIR = path.join(PROJECT_ROOT, 'src', 'sections')
const EXTENSION_PRIORITY: DesignFileExtension[] = ['astro', 'svelte', 'tsx']

function getFileExtension(fileName: string): DesignFileExtension | null {
  const match = fileName.match(/\.(tsx|svelte|astro)$/)
  if (!match) return null
  return match[1] as DesignFileExtension
}

function getExtensionPriority(extension: DesignFileExtension): number {
  const index = EXTENSION_PRIORITY.indexOf(extension)
  return index === -1 ? EXTENSION_PRIORITY.length : index
}

async function safeReadDir(dir: string) {
  try {
    return await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

export async function getSectionIds(): Promise<string[]> {
  const sectionIds = new Set<string>()
  const productEntries = await safeReadDir(PRODUCT_SECTIONS_DIR)
  const srcEntries = await safeReadDir(SRC_SECTIONS_DIR)

  for (const entry of productEntries) {
    if (entry.isDirectory()) {
      sectionIds.add(entry.name)
    }
  }

  for (const entry of srcEntries) {
    if (entry.isDirectory()) {
      sectionIds.add(entry.name)
    }
  }

  return Array.from(sectionIds).sort()
}

export interface ScreenDesignPath {
  sectionId: string
  screenDesignName: string
}

export async function getScreenDesignPaths(): Promise<ScreenDesignPath[]> {
  const paths: ScreenDesignPath[] = []
  const srcEntries = await safeReadDir(SRC_SECTIONS_DIR)

  for (const sectionEntry of srcEntries) {
    if (!sectionEntry.isDirectory()) continue
    const sectionId = sectionEntry.name
    const sectionDir = path.join(SRC_SECTIONS_DIR, sectionId)
    const sectionFiles = await safeReadDir(sectionDir)
    const selectedByScreenName = new Map<string, { extension: DesignFileExtension }>()

    for (const sectionFile of sectionFiles) {
      if (!sectionFile.isFile()) continue
      const extension = getFileExtension(sectionFile.name)
      if (!extension) continue
      const screenDesignName = sectionFile.name.replace(/\.(tsx|svelte|astro)$/, '')
      const existing = selectedByScreenName.get(screenDesignName)
      if (!existing) {
        selectedByScreenName.set(screenDesignName, { extension })
        continue
      }
      if (getExtensionPriority(extension) < getExtensionPriority(existing.extension)) {
        selectedByScreenName.set(screenDesignName, { extension })
      }
    }

    for (const screenDesignName of selectedByScreenName.keys()) {
      paths.push({ sectionId, screenDesignName })
    }
  }

  return paths.sort((a, b) => {
    if (a.sectionId !== b.sectionId) {
      return a.sectionId.localeCompare(b.sectionId)
    }
    return a.screenDesignName.localeCompare(b.screenDesignName)
  })
}
