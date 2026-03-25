import { createBrowserRouter } from 'react-router-dom'
import { ProductPage } from '@/components/ProductPage'
import { DataShapePage } from '@/components/DataShapePage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage } from '@/components/ScreenDesignPage'
import { ShellDesignPage } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductPage />,
  },
  {
    path: '/data-shape',
    element: <DataShapePage />,
  },
  {
    path: '/design',
    element: <DesignPage />,
  },
  {
    path: '/sections',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName',
    element: <ScreenDesignPage />,
  },
  {
    path: '/shell/design',
    element: <ShellDesignPage />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
])
