import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url))
const PRODUCT_SECTIONS_DIR = path.join(PROJECT_ROOT, 'product', 'sections')
const SRC_SECTIONS_DIR = path.join(PROJECT_ROOT, 'src', 'sections')

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

    for (const sectionFile of sectionFiles) {
      if (!sectionFile.isFile()) continue
      if (!sectionFile.name.endsWith('.tsx')) continue
      const screenDesignName = sectionFile.name.replace(/\.tsx$/, '')
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
