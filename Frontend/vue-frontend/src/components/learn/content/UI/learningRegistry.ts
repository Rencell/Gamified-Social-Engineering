import { defineAsyncComponent, type Component } from 'vue'

// Type Definition for Learning Components
export type LearningType =
  | 'LearningSection'
  | 'LearningHeader'
  | 'LearningBody'
  | 'LearningList'
  | 'LearningListItem'
  | 'LearningListItemNumbered'
  | 'LearningQuote'
  | 'InteractiveMCQ'
  | 'LearningImage2'
  | 'FlippingCard'
  | 'DescriptionList'
  | 'TwoImage'
  | 'ToolTipImage'
  | 'NextCard'
// Component Map
export const componentMap: Record<LearningType, Component> = {
  LearningSection: defineAsyncComponent(() => import('../UI/Learning/Core/LearningSection.vue')),
  LearningHeader: defineAsyncComponent(() => import('../UI/Learning/Core/LearningHeader.vue')),
  LearningBody: defineAsyncComponent(() => import('../UI/Learning/Core/LearningBody.vue')),
  LearningList: defineAsyncComponent(() => import('../UI/Learning/Listing/LearningList.vue')),
  LearningListItem: defineAsyncComponent(
    () => import('../UI/Learning/Listing/LearningListItem.vue'),
  ),
  LearningListItemNumbered: defineAsyncComponent(
    () => import('../UI/Learning/Listing/LearningListItemNumbered.vue'),
  ),
  LearningQuote: defineAsyncComponent(() => import('../UI/Learning/Highlight/LearningQuote.vue')),
  LearningImage2: defineAsyncComponent(() => import('../UI/Learning/Image/LearningImage2.vue')),
  // Interactive
  InteractiveMCQ: defineAsyncComponent(() => import('../UI/Interactive/InteractiveMCQ.vue')),
  FlippingCard: defineAsyncComponent(() => import('../UI/Interactive/FlippingCard.vue')),
  ToolTipImage: defineAsyncComponent(() => import('../UI/Interactive/ToolTipImage.vue')),
  TwoImage: defineAsyncComponent(() => import('../UI/Interactive/TwoImage.vue')),
  NextCard: defineAsyncComponent(() => import('../UI/Interactive/NextCard.vue')),
  // Listing
  DescriptionList: defineAsyncComponent(
    () => import('../UI/Learning/Listing/description-list.vue'),
  ),
}
export interface MCQOption {
  id: string
  text: string
}

export type DefaultProps = {
  LearningSection: unknown
  LearningHeader: { text: string }
  LearningBody: { text: string }
  LearningList: unknown
  LearningListItem: { text: string }
  LearningListItemNumbered: { image: string; text: string; number: number }
  LearningQuote: { variant: string; text: string }
  InteractiveMCQ: { question: string; options: MCQOption[]; answer: string }
  LearningImage2: { image: string }
  FlippingCard: { data: [{ front: string; back: string }] }
  TwoImage: {
    data: {
      Question: string
      image1: string
      image2: string
      answer?: 'image1' | 'image2'
      explanation?: string
      positionLeft?: boolean
    }
  }

  ToolTipImage: {
    areas: [
      {
        id: string
        title: string
        description: string
        x: number
        y: number
        position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright'
      },
    ]
    image: string
  }
  NextCard: {
    data: { id: number; head: string; text: string; image: string }[]
  }
  DescriptionList: {
    data: [
      {
        heading: string
        subheading: string
        image: string
        description: string
        examples: {
          example: string
          image: string
        }[]
        signs: string[]
      },
    ]
  }
}

// Default Props Map
export const defaultPropsMap: DefaultProps = {
  LearningSection: {},
  LearningHeader: { text: 'New Header' },
  LearningBody: { text: 'New Body' },
  LearningList: {},
  LearningListItem: { text: 'New List Item' },
  LearningListItemNumbered: { image: '', text: 'string', number: 0 },
  LearningQuote: { variant: 'default', text: 'New Quote' },
  InteractiveMCQ: {
    question: 'New Question',
    options: [
      { id: 'A', text: 'Option 1' },
      { id: 'B', text: 'Option 2' },
    ],
    answer: 'A',
  },
  LearningImage2: { image: '/media/content_images/WIN_20250827_21_25_06_Pro.jpg' },
  FlippingCard: { data: [{ front: 'Front Side', back: 'Back Side' }] },
  TwoImage: {
    data: {
      Question: 'New Question',
      image1: 'Image1.jpg',
      image2: 'Image2.jpg',
      answer: 'image1',
      explanation: 'explain',
      positionLeft: true,
    },
  },

  ToolTipImage: {
    areas: [
      
      {
        id: '1',
        title: 'Hotspot 1',
        description: 'Description for Hotspot 1',
        x: 100,
        y: 150,
        position: 'topleft',
      },
    ],
    image: '/media/content_images/Website.png',
  },
  NextCard: {
    data: [
      {
        id: 1,
        head: "Header Text",
        text: "text content",
        image:'/media/content_images/Website.png'
      }
    ]
  },
  DescriptionList: {
    data: [
      {
        heading: 'New Heading',
        subheading: 'New Subheading',
        image: 'New Image',
        description: 'New Description',
        examples: [
          { example: 'Example 1', image: 'ExampleImage1.jpg' },
          { example: 'Example 2', image: 'ExampleImage2.jpg' },
        ],
        signs: ['Sign 1', 'Sign 2'],
      },
    ],
  },
}

export const PropsMultiSelector: Record<string, Record<string, any>> = {
  LearningQuote: {
    variant: {
      options: ['default', 'info', 'danger'],
      default: 'default',
    },
  },
}
